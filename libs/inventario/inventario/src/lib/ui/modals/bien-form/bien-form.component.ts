import {
  ChangeDetectionStrategy, Component, EventEmitter, Input,
  OnInit, Output, inject, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bien, BienFormDto } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bien-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bien-form.component.html',
  styleUrl: './bien-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() bien?: Bien;

  @Output() save = new EventEmitter<BienFormDto>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  readonly CATEGORIAS = [
    'Equipos de Cómputo', 'Mobiliario', 'Papelería', 'Cocina',
    'Audiovisuales', 'Herramientas', 'Electrodomésticos', 'Otro',
  ];

  readonly PROVEEDORES = [
    'Dell Colombia S.A.S.', 'Distribuidora Tecnológica', 'Papelería Nacional S.A.',
    'Muebles y Más S.A.S.', 'Equipo Chef Colombia',
  ];

  readonly IVA_OPTIONS = [{ label: '0%', value: 0 }, { label: '5%', value: 5 }, { label: '19%', value: 19 }];

  readonly isEdit = computed(() => this.mode === 'edit');
  readonly umBloqueada = computed(() => this.mode === 'edit' && !!this.bien?.tieneHistorial);

  valorTotal = signal(0);

  ngOnInit(): void {
    this.initForm();
    if (this.mode === 'edit' && this.bien) {
      this.form.patchValue({
        codigoSena: this.bien.codigoSena,
        codigoProveedor: this.bien.codigoProveedor,
        nombre: this.bien.nombre,
        categoria: this.bien.categoria,
        stockActual: this.bien.stockActual,
        stockMinimo: this.bien.stockMinimo,
        unidadMedida: this.bien.unidadMedida,
        factorConversion: this.bien.factorConversion ?? 1,
        proveedor: this.bien.proveedor ?? '',
        valorNeto: this.bien.valorNeto ?? this.bien.valor,
        iva: this.bien.iva ?? 19,
        estado: this.bien.estado,
      });
      if (this.umBloqueada()) {
        this.form.get('unidadMedida')?.disable();
      }
      this.recalcularTotal();
    }

    this.form.get('valorNeto')?.valueChanges.subscribe(() => this.recalcularTotal());
    this.form.get('iva')?.valueChanges.subscribe(() => this.recalcularTotal());
  }

  private initForm(): void {
    this.form = this.fb.group({
      codigoSena: [{ value: '', disabled: true }],
      codigoProveedor: [''],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', Validators.required],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [5, [Validators.required, Validators.min(0)]],
      unidadMedida: ['', Validators.required],
      kilos: [0],
      factorConversion: [1],
      proveedor: [''],
      valorNeto: [0, [Validators.required, Validators.min(0)]],
      iva: [19],
      estado: ['Activo'],
    });
  }

  private recalcularTotal(): void {
    const neto = +this.form.get('valorNeto')?.value || 0;
    const iva = +this.form.get('iva')?.value || 0;
    this.valorTotal.set(Math.round(neto * (1 + iva / 100)));
  }

  onSubmit(): void {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const dto: BienFormDto = {
        ...raw,
        valor: this.valorTotal(),
      };
      this.save.emit(dto);
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
