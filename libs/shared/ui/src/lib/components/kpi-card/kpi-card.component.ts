import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type KpiCardIconColor = 'green' | 'blue' | 'red' | 'orange';

@Component({
  selector: 'restaurant-kpi-card',
  standalone: true,
  imports: [CommonModule],
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
                <span class="material-symbols-outlined">trending_up</span>
              } @else if (trendUp === false) {
                <span class="material-symbols-outlined">trending_down</span>
              }
              <span>{{ trend }}</span>
            </div>
          }
        </div>
        @if (icon) {
          <div class="kpi-card__icon" [class]="'kpi-card__icon--' + iconColor">
            <span class="material-symbols-outlined">{{ icon }}</span>
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
