import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EmptyStateComponent, PageHeaderComponent } from '@restaurant/shared/ui';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'restaurant-abastecimiento-page',
  standalone: true,
  imports: [PageHeaderComponent, EmptyStateComponent],
  template: `
    <restaurant-page-header
      [title]="i18n.t('page.title')"
      [subtitle]="i18n.t('page.subtitle')"
    ></restaurant-page-header>

    <restaurant-empty-state
      [title]="i18n.t('empty.title')"
      [message]="i18n.t('empty.message')"
    ></restaurant-empty-state>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbastecimientoPageComponent {
  protected readonly i18n = inject(I18nService);
}
