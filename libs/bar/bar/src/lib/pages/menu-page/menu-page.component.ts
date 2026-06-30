import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EmptyStateComponent } from '@restaurant/shared/ui';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'restaurant-bar-menu-page',
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <div style="padding: 2rem;">
      <restaurant-empty-state
        [title]="i18n.t('menu.page.title')"
        [message]="i18n.t('menu.page.message')"
      ></restaurant-empty-state>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPageComponent {
  protected readonly i18n = inject(I18nService);
}
