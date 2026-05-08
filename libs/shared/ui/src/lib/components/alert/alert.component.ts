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
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  type    = input<'success' | 'error' | 'warning' | 'info'>('info');
  message = input.required<string>();
}
