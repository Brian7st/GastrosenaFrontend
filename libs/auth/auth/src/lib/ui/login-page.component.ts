import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@restaurant/shared/auth';
import { AlertComponent, InputComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertComponent, InputComponent, ButtonComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly loading  = signal(false);
  readonly errorMsg = signal('');

  readonly form = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly panelFeatures = [
    'Gestión de inventario en tiempo real',
    'Control de cocina y órdenes',
    'Módulo de cafetería y bar',
    'Reportes y estadísticas',
    'Administración de recetas',
  ];

  get emailCtrl() { return this.form.get('email')!; }
  get passCtrl()  { return this.form.get('contrasena')!; }

async onSubmit(): Promise<void> {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.loading.set(true);
  this.errorMsg.set('');
  try {
    const { email, contrasena } = this.form.getRawValue();
    await this.authService.login(email!, contrasena!); // ✅ espera el login
    await this.router.navigateByUrl('/app/inventario'); // solo si login OK
  } catch (err) {
    this.errorMsg.set('Credenciales inválidas. Verificá tu correo y contraseña.');
  } finally {
    this.loading.set(false);
  }
}
}