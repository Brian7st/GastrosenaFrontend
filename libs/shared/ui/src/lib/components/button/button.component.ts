import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'surface' | 'ghost' | 'filter';

@Component({
  selector: 'restaurant-button',
  standalone: true,
  imports: [],
  template: `
    <button
      class="app-btn"
      [class]="'app-btn--' + variant"
      [disabled]="disabled"
      [type]="type"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
