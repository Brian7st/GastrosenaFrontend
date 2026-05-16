import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  // Lista temporal para maqueta. Luego vendrá del Facade.
  categories = [
    { id: 'all', name: 'All Menu', items: '116 items', icon: '🍽️', active: true },
    { id: 'coffee', name: 'Coffee', items: '24 items', icon: '☕', active: false },
    { id: 'tea', name: 'Tea', items: '15 items', icon: '🍵', active: false },
    { id: 'mocktail', name: 'Mocktail', items: '8 items', icon: '🍹', active: false },
    { id: 'rice', name: 'Rice', items: '12 items', icon: '🍚', active: false },
    { id: 'pasta', name: 'Pasta', items: '8 items', icon: '🍝', active: false },
    { id: 'burger', name: 'Burger', items: '16 items', icon: '🍔', active: false },
  ];
}
