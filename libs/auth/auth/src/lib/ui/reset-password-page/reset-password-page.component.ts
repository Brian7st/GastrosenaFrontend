import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@restaurant/shared/auth';
import { AlertComponent, InputComponent, ButtonComponent } from '@restaurant/shared/ui';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'restaurant-reset-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertComponent, InputComponent, ButtonComponent],
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  protected readonly i18n = inject(I18nService);

  readonly loading = signal(false);
  readonly errorMsg = signal('');
  readonly successMsg = signal('');
  readonly token = this.route.snapshot.queryParamMap.get('token');

  readonly form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  get passwordCtrl() {
    return this.form.get('password')!;
  }

  get confirmPasswordCtrl() {
    return this.form.get('confirmPassword')!;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.token) {
      this.errorMsg.set(this.i18n.t('reset.error_token'));
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    try {
      await this.authService.resetPassword(this.token, this.form.value.password!);
      this.successMsg.set(this.i18n.t('reset.success'));
      setTimeout(() => this.router.navigateByUrl('/auth/login'), 3000);
    } catch (err: any) {
      const mensaje = err.error?.error || 'Error al restablecer la contraseña. El enlace pudo haber expirado.';
      this.errorMsg.set(mensaje);
    } finally {
      this.loading.set(false);
    }
  }
}