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

  readonly isEdit = computed(() => this.mode === 'edit');
  readonly umBloqueada = computed(() => this.mode === 'edit' && !!this.bien?.tieneHistorial);

  ngOnInit(): void {
    this.initForm();

    if (this.mode === 'edit' && this.bien) {
      const bien = this.bien as Bien & {
        vrlAdjudicado?: number | null;
        vrlAntes?: number | null;
      };

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
