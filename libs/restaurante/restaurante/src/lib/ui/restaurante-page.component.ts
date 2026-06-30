import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EmptyStateComponent, PageHeaderComponent } from '@restaurant/shared/ui';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'restaurant-restaurante-page',
  standalone: true,
  imports: [PageHeaderComponent, EmptyStateComponent],
  template: `
    <restaurant-page-header
      [title]="i18n.t('restaurantePage.title')"
      [subtitle]="i18n.t('restaurantePage.subtitle')"
    ></restaurant-page-header>

    <restaurant-empty-state
      [title]="i18n.t('restaurantePage.createdTitle')"
      [message]="i18n.t('restaurantePage.createdMessage')"
    ></restaurant-empty-state>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantePageComponent {
  protected readonly i18n = inject(I18nService);
}
