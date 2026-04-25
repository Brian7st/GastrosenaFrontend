import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AlertComponent }    from '@restaurant/shared/ui';
import { CommentsService }   from '../../data-access/comments.service';

@Component({
  selector: 'restaurant-comments-form',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './comments-form.component.html',
  styleUrl: './comments-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsFormComponent {
  private fb              = inject(FormBuilder);
  private commentsService = inject(CommentsService);

  isLoading      = signal(false);
  successMessage = signal('');
  errorMessage   = signal('');

  form = this.fb.group({
    name:    ['', [Validators.required, Validators.minLength(2)]],
    email:   ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  get name()    { return this.form.get('name')!;    }
  get email()   { return this.form.get('email')!;   }
  get message() { return this.form.get('message')!; }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const { name, email, message } = this.form.getRawValue();
    this.commentsService.sendComment({ name: name!, email: email!, message: message! }).subscribe({
      next: res => {
        this.isLoading.set(false);
        if (res.success) {
          this.successMessage.set(res.message);
          this.form.reset();
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Ocurrió un error al enviar tu mensaje. Intenta de nuevo.');
      },
    });
  }
}
