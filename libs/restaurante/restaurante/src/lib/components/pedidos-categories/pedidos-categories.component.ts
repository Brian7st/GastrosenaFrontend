import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { I18nService } from '../../i18n/i18n.service';

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

  @Output() categorySelected = new EventEmitter<string>();
  @Output() subcategorySelected = new EventEmitter<string>();

  categories = computed(() => [
    { id: 'all', name: this.i18n.t('pedidosCategories.all'), icon: 'layout-grid' },
    { id: 'entrada', name: this.i18n.t('pedidosCategories.entrada'), icon: 'clipboard-list' },
    { id: 'plato_fuerte', name: this.i18n.t('pedidosCategories.platoFuerte'), icon: 'utensils' },
    { id: 'postre', name: this.i18n.t('pedidosCategories.postre'), icon: 'cake' },
    { id: 'bebidas', name: this.i18n.t('pedidosCategories.bebidas'), icon: 'coffee' },
  ]);

  subcategoriesBebidas = computed(() => [
    { id: 'calientes', name: this.i18n.t('pedidosCategories.calientes') },
    { id: 'frias', name: this.i18n.t('pedidosCategories.frias') },
    { id: 'sin_alcohol', name: this.i18n.t('pedidosCategories.sinAlcohol') },
    { id: 'con_alcohol', name: this.i18n.t('pedidosCategories.conAlcohol') },
  ]);

  activeCategory = signal<string>('all');
  activeSubcategory = signal<string>('');

  selectCategory(id: string) {
    this.activeCategory.set(id);
    this.activeSubcategory.set('');
    this.categorySelected.emit(id);
    this.subcategorySelected.emit('');
  }

  selectSubcategory(id: string) {
    this.activeSubcategory.set(id);
    this.subcategorySelected.emit(id);
  }
}
