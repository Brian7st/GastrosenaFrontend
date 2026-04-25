import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'restaurant-status-badge',
  standalone: true,
  template: `<span class="status-badge" [class]="'status-badge status-badge--' + variant">{{ label }}</span>`,
  styleUrl: './status-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  @Input({ required: true }) label!: string;
  @Input() variant: 'success' | 'warning' | 'danger' | 'info' = 'info';
}
