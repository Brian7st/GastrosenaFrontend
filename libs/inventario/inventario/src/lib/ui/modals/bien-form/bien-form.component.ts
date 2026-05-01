import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { Bien, BienFormDto } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bien-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideIconComponent],
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

  ngOnInit(): void {
    this.initForm();
    if (this.mode === 'edit' && this.bien) {
      this.form.patchValue(this.bien);
      
      // Regla de negocio: Si tiene historial, la UM no se puede cambiar
      if (this.bien.tieneHistorial) {
        this.form.get('unidadMedida')?.disable();
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigoSena: [{ value: '', disabled: true }],
      codigoProveedor: [''],
      descripcion: [''],
      categoria: ['', Validators.required],
      unidadMedida: ['', Validators.required],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [5, [Validators.required, Validators.min(0)]],
      valor: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
