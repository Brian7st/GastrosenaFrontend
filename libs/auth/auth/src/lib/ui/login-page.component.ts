import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@restaurant/shared/auth';
import { AlertComponent, InputComponent, ButtonComponent } from '@restaurant/shared/ui';
import { I18nService } from '../i18n/i18n.service';

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
  protected readonly i18n = inject(I18nService);

  readonly loading = signal(false);
  readonly errorMsg = signal('');
  readonly mostrarContrasena = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly panelFeatures = computed(() => [
    this.i18n.t('panel.feature1'),
    this.i18n.t('panel.feature2'),
    this.i18n.t('panel.feature3'),
    this.i18n.t('panel.feature4'),
    this.i18n.t('panel.feature5'),
  ]);

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
      await this.authService.login(email!, contrasena!);

      // Todos los roles aterrizan en el dashboard tras el login.
      // El menú/guards ya filtran qué módulos ve cada rol.
      await this.router.navigateByUrl('/app/dashboard');
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 423) {
        const minutos = err.error?.minutosRestantes;
        const msg = minutos !== -1
          ? this.i18n.t('login.error_bloqueada_temporal').replace('{minutos}', String(Math.max(1, minutos)))
          : this.i18n.t('login.error_bloqueada_permanente');
        this.errorMsg.set(msg);
      } else {
        this.errorMsg.set(this.i18n.t('login.error'));
      }
    } finally {
      this.loading.set(false);
    }
  }
}