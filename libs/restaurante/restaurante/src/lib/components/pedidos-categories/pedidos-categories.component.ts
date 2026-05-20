import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-pedidos-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-categories.component.html',
  styleUrls: ['./pedidos-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosCategoriesComponent {
  @Output() categorySelected = new EventEmitter<string>();
  @Output() subcategorySelected = new EventEmitter<string>();

  categories = [
    { id: 'all', name: 'Todo', icon: '🍽️' },
    { id: 'entrada', name: 'Entradas', icon: '🥗' },
    { id: 'plato_fuerte', name: 'Plato Fuerte', icon: '🥩' },
    { id: 'postre', name: 'Postres', icon: '🍰' },
    { id: 'bebidas', name: 'Bebidas', icon: '🍹' },
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
