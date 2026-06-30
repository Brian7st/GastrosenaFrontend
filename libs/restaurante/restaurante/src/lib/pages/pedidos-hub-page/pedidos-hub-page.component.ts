import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideIconComponent, CardComponent, PageHeaderComponent, ButtonComponent } from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'restaurant-pedidos-hub-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideIconComponent,
    CardComponent,
    PageHeaderComponent,
    ButtonComponent
  ],
  templateUrl: './pedidos-hub-page.component.html',
  styleUrls: ['./pedidos-hub-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosHubPageComponent {
  protected readonly i18n = inject(I18nService);
  private facade = inject(RestauranteFacade);
  puedeAdministrarMesas = this.facade.puedeAdministrarMesas;
}
