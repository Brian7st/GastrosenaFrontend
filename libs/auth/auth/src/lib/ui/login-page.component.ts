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

  readonly loading = signal(false);
  readonly errorMsg = signal('');
  readonly mostrarContrasena = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly panelFeatures = [
    'Gestión de inventario en tiempo real',
    'Control de cocina y órdenes',
    'Módulo de cafetería y bar',
    'Reportes y estadísticas',
    'Administración de recetas',
  ];

  get emailCtrl() {
    return this.form.get('email')!;
  }

  get passCtrl() {
    return this.form.get('contrasena')!;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');

    try {
      const { email, contrasena } = this.form.getRawValue();
      const user = await this.authService.login(email!, contrasena!);

      const rol = user?.rol;
      let destino = '/app/perfil'; // valor por defecto

      // Redirección por rol (según los roles definidos en backend)
      switch (rol) {
        case 'ADMINISTRADOR':
          destino = '/app/usuarios';
          break;
        case 'INSTRUCTOR':
        case 'CHEF':
          destino = '/app/cocina';
          break;
        case 'CONTADORA':
          destino = '/app/inventario';
          break;
        case 'MESERO':
        case 'BARTENDER':
          destino = '/app/restaurante';
          break;
        case 'CAJERO':
          destino = '/app/restaurante/facturacion'; // o donde manejes facturación
          break;
        case 'AUXILIAR_COCINA':
          destino = '/app/cocina';
          break;
        case 'APRENDIZ':
          destino = '/app/perfil';
          break;
        default:
          destino = '/app/perfil';
      }

      await this.router.navigateByUrl(destino);
    } catch (err) {
      this.errorMsg.set('Credenciales inválidas. Verificá tu correo y contraseña.');
    } finally {
      this.loading.set(false);
    }
  }
}