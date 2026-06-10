import {
  ChangeDetectionStrategy, Component, EventEmitter, Input,
  OnInit, Output, inject, computed
} from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bien, BienFormDto } from '../../../models/inventario.model';
import { CATEGORIAS_BIEN } from '../../../models/categorias.model';

@Component({
  selector: 'restaurant-bien-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './bien-form.component.html',
  styleUrl: './bien-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() bien?: Bien;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() save = new EventEmitter<BienFormDto>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  readonly CATEGORIAS = CATEGORIAS_BIEN;

  /**
   * Categorías a renderizar. Igual que con la UM, los bienes de contrato/import
   * pueden traer una categoría que no está en la lista canónica; si el valor
   * guardado no figura, lo agregamos para que el select pueda mostrarlo.
   */
  categorias: string[] = [...CATEGORIAS_BIEN];

  /** Opciones canónicas de unidad de medida. */
  private readonly UM_BASE: ReadonlyArray<{ value: string; label: string }> = [
    { value: 'UND',  label: 'UND – Unidad' },
    { value: 'KG',   label: 'KG – Kilogramo' },
    { value: 'L',    label: 'L – Litro' },
    { value: 'M',    label: 'M – Metro' },
    { value: 'SET',  label: 'SET – Set' },
    { value: 'CAJA', label: 'CAJA – Caja' },
  ];

  /**
   * Opciones de UM a renderizar. En edición, los bienes nacidos de contrato o
   * de imports traen la UM como texto libre (ej. "Kilogramo") que no coincide
   * con los valores canónicos; sin una opción que matchee, el select queda en
   * blanco. Por eso, si el valor guardado no está en la lista, lo agregamos.
   */
  unidadesMedida: { value: string; label: string }[] = [...this.UM_BASE];

  readonly isEdit = computed(() => this.mode === 'edit');
  readonly umBloqueada = computed(() => this.mode === 'edit' && !!this.bien?.tieneHistorial);

  ngOnInit(): void {
    this.initForm();

    if (this.mode === 'edit' && this.bien) {
      const bien = this.bien as Bien & {
        vrlAdjudicado?: number | null;
        vrlAntes?: number | null;
      };

      // Si la UM guardada no está entre las opciones canónicas, la sumamos para
      // que el select pueda mostrarla (bienes de contrato/import con texto libre).
      const um = bien.unidadMedida;
      if (um && !this.unidadesMedida.some(o => o.value === um)) {
        this.unidadesMedida = [{ value: um, label: um }, ...this.unidadesMedida];
      }

      // Misma tolerancia para la categoría guardada.
      const cat = bien.categoria;
      if (cat && !this.categorias.includes(cat)) {
        this.categorias = [cat, ...this.categorias];
      }

      this.form.patchValue({
        codigoSena:      bien.codigoSena,
        codigoProveedor: bien.codigoProveedor,
        descripcion:     bien.descripcion ?? '',
        categoria:       bien.categoria,
        unidadMedida:    bien.unidadMedida,
        vrlAdjudicado:   bien.vrlAdjudicado ?? bien.valor ?? null,
        vrlAntes:        bien.vrlAntes ?? bien.valorNeto ?? null,
        iva:             bien.iva ?? null,
        stockMinimo:     bien.stockMinimo ?? null,
      });

      // En edicion el codigo SENA es inmutable - no se puede cambiar
      this.form.get('codigoSena')?.disable();
      if (this.umBloqueada()) {
        this.form.get('unidadMedida')?.disable();
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      codigoSena:      ['', Validators.required],
      codigoProveedor: [''],
      descripcion:     ['', [Validators.required, Validators.minLength(3)]],
      categoria:       ['', Validators.required],
      unidadMedida:    ['', Validators.required],
      vrlAdjudicado:   this.fb.control<number | null>(null),
      vrlAntes:        this.fb.control<number | null>(null),
      iva:             this.fb.control<number | null>(null),
      stockMinimo:     this.fb.control<number | null>(null),
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue() as BienFormDto);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
