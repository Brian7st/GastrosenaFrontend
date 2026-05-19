import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Rol } from '@restaurant/shared/models';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { CrearUsuarioRequest } from '../../models/usuarios.model';

@Component({
  selector: 'restaurant-usuario-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LucideIconComponent],
  templateUrl: './usuario-form.component.html',
  styleUrl:    './usuario-form.component.scss',
})
export class UsuarioFormComponent {
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
    idRol:      ['', Validators.required],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
  });

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardar.emit(this.form.getRawValue());
  }
}
