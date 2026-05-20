import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AlertComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);

  readonly loading  = signal(false);
  readonly errorMsg = signal('');
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
      // TODO: conectar con el endpoint de recuperación
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.successMsg.set('Te enviamos las instrucciones a tu correo electrónico.');
    } catch {
      this.errorMsg.set('No encontramos una cuenta con ese correo. Verificá e intentá de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }
}