import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'restaurant-alert',
  standalone: true,
  imports: [],
  template: `
    <div class="alert" [class]="'alert--' + type()" role="alert">
      <span class="alert__message">{{ message() }}</span>
    </div>
  `,
  styles: [`
    .alert {
      padding: 0.875rem 1.25rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.9375rem;
      &--success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
      &--error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
      &--warning { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
      &--info    { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  type    = input<'success' | 'error' | 'warning' | 'info'>('info');
  message = input.required<string>();
}
