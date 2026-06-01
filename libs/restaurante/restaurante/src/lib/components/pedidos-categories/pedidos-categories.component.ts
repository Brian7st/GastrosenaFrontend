import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'lib-pedidos-categories',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './pedidos-categories.component.html',
  styleUrls: ['./pedidos-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosCategoriesComponent {
  @Output() categorySelected = new EventEmitter<string>();
  @Output() subcategorySelected = new EventEmitter<string>();

  categories = [
    { id: 'all', name: 'Todo', icon: 'layout-grid' },
    { id: 'entrada', name: 'Entradas', icon: 'salad' },
    { id: 'plato_fuerte', name: 'Plato Fuerte', icon: 'beef' },
    { id: 'postre', name: 'Postres', icon: 'cake' },
    { id: 'bebidas', name: 'Bebidas', icon: 'coffee' },
  ];

  subcategoriesBebidas = [
    { id: 'calientes', name: 'Calientes' },
    { id: 'frias', name: 'Frías' },
    { id: 'sin_alcohol', name: 'Sin Alcohol' },
    { id: 'con_alcohol', name: 'Con Alcohol' },
  ];

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
