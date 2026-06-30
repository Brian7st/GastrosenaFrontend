import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { I18nService } from '../../i18n/i18n.service';
import { RestauranteFacade } from '../../data-access/restaurante.facade';

@Component({
  selector: 'lib-pedidos-categories',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './pedidos-categories.component.html',
  styleUrls: ['./pedidos-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosCategoriesComponent {
  protected readonly i18n = inject(I18nService);
  private readonly facade = inject(RestauranteFacade);

  @Output() filterChanged = new EventEmitter<{ main: string; sub: string }>();

  // Categorías dinámicas derivadas de las recetas (incluye "Todo" al inicio).
  // Así el filtro de restaurante queda consistente con las categorías que se
  // crean en cocina: si aparece una receta con una categoría nueva, su chip
  // aparece solo.
  readonly categories = this.facade.categoriasMenu;

  readonly activeCategory = signal<string>('all');

  selectCategory(id: string): void {
    this.activeCategory.set(id);
    this.filterChanged.emit({ main: id, sub: 'all' });
  }
}
