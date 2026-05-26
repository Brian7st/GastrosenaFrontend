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
      this.form.patchValue({
        codigoSena:      this.bien.codigoSena,
        codigoProveedor: this.bien.codigoProveedor,
        nombre:          this.bien.nombre,
        descripcion:     this.bien.descripcion ?? '',
        categoria:       this.bien.categoria,
        unidadMedida:    this.bien.unidadMedida,
        imagenUrl:       this.bien.imagenUrl ?? '',
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
      imagenUrl:       [''],
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

  onImagenSeleccionada(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({ imagenUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
