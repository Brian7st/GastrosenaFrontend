import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Rol } from '@restaurant/shared/models';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { CrearUsuarioRequest, UsuarioDetalle } from '../../models/usuarios.model';

@Component({
  selector: 'restaurant-usuario-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LucideIconComponent],
  templateUrl: './usuario-form.component.html',
  styleUrl:    './usuario-form.component.scss',
})
export class UsuarioFormComponent implements OnChanges {
  @Input() usuario: UsuarioDetalle | null = null;
  @Output() guardar = new EventEmitter<CrearUsuarioRequest>();
  @Output() cerrar  = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  readonly rolOptions = Object.values(Rol);

  readonly form = this.fb.nonNullable.group({
  nombre:     ['', Validators.required],
  apellidos:  ['', Validators.required],
  email:      ['', [Validators.required, Validators.email]],
  documento:  ['', Validators.required],
  telefono:   ['', Validators.required],
  nombreRol:  ['', Validators.required],  // ← cambio
  contrasena: ['', [Validators.required, Validators.minLength(8)]],
});

  get modoEdicion(): boolean {
    return this.usuario !== null;
  }

  ngOnChanges(): void {
    if (this.usuario) {
      this.form.patchValue({
        nombre:    this.usuario.nombre,
        apellidos: this.usuario.apellidos,
        email:     this.usuario.email,
        documento: this.usuario.documento,
        telefono:  this.usuario.telefono,
        nombreRol: this.usuario.rol,  // ← cambio
      });
      this.form.controls.contrasena.clearValidators();
      this.form.controls.contrasena.setValue('');
      this.form.controls.contrasena.updateValueAndValidity();
    } else {
      this.form.reset();
      this.form.controls.contrasena.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
      this.form.controls.contrasena.updateValueAndValidity();
    }
  }

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardar.emit(this.form.getRawValue());
  }
}
