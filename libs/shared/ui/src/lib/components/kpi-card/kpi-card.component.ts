import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

export type KpiCardIconColor = 'green' | 'blue' | 'red' | 'orange';

@Component({
  selector: 'restaurant-kpi-card',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <div class="kpi-card" [class.kpi-card--states]="variant === 'states'">
      @if (variant === 'states') {
        <ng-content></ng-content>
      } @else {
        <div class="kpi-card__body">
          <span class="kpi-card__label">{{ label }}</span>
          <span class="kpi-card__value">{{ value }}</span>
          @if (trend) {
            <div
              class="kpi-card__trend"
              [class.kpi-card__trend--up]="trendUp === true"
              [class.kpi-card__trend--down]="trendUp === false"
              [class.kpi-card__trend--neutral]="trendUp === null"
            >
              @if (trendUp === true) {
                <lucide-icon name="trending-up" [size]="16"></lucide-icon>
              } @else if (trendUp === false) {
                <lucide-icon name="trending-down" [size]="16"></lucide-icon>
              }
              <span>{{ trend }}</span>
            </div>
          }
        </div>
        @if (icon) {
          <div class="kpi-card__icon" [class]="'kpi-card__icon--' + iconColor">
            <lucide-icon [name]="icon" [size]="24"></lucide-icon>
          </div>
        }
      }
    </div>
  `,
  styleUrl: './kpi-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() icon = '';
  @Input() iconColor: KpiCardIconColor = 'green';
  @Input() trend = '';
  @Input() trendUp: boolean | null = true;
  @Input() variant: 'default' | 'states' = 'default';
}
