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
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'restaurant-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertComponent, InputComponent, ButtonComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  protected readonly i18n = inject(I18nService);

  readonly loading    = signal(false);
  readonly errorMsg   = signal('');
  readonly successMsg = signal('');

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get emailCtrl() { return this.form.get('email')!; }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');
    try {
      const { email } = this.form.getRawValue();
      await this.authService.recuperarContrasena(email!);
      this.successMsg.set(this.i18n.t('forgot.success'));
      setTimeout(() => this.router.navigateByUrl('/auth/login'), 3000);
    } catch {
      this.errorMsg.set(this.i18n.t('forgot.error'));
    } finally {
      this.loading.set(false);
    }
  }
}