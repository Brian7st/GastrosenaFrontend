import {
  ChangeDetectionStrategy, Component, EventEmitter, Input,
  OnInit, Output, inject, computed
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

  readonly isEdit = computed(() => this.mode === 'edit');
  readonly umBloqueada = computed(() => this.mode === 'edit' && !!this.bien?.tieneHistorial);

  ngOnInit(): void {
    this.initForm();
    if (this.mode === 'edit' && this.bien) {
      this.form.patchValue({
        codigoSena:      this.bien.codigoSena,
        codigoProveedor: this.bien.codigoProveedor,
        nombre:          this.bien.nombre,
        descripcion:     this.bien.descripcion ?? '',
        categoria:       this.bien.categoria,
        unidadMedida:    this.bien.unidadMedida,
      });
      if (this.umBloqueada()) {
        this.form.get('unidadMedida')?.disable();
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      codigoSena:      [{ value: '', disabled: true }],
      codigoProveedor: [''],
      nombre:          ['', [Validators.required, Validators.minLength(3)]],
      descripcion:     [''],
      categoria:       ['', Validators.required],
      unidadMedida:    ['', Validators.required],
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
