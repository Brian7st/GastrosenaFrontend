import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { CardComponent, LucideIconComponent, StatusBadgeComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'lib-pedidos-menu-grid',
  standalone: true,
  imports: [CommonModule, CardComponent, LucideIconComponent, StatusBadgeComponent],
  templateUrl: './pedidos-menu-grid.component.html',
  styleUrls: ['./pedidos-menu-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosMenuGridComponent {
  // Datos temporales simulando el backend
  products = [
    { id: '1', name: 'Coffee Latte', price: 21.20, originalPrice: 26.20, available: 72, sold: 14, discount: '20% OFF', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80' },
    { id: '2', name: 'Bolognese Spaghetti', price: 21.20, available: 8, sold: 32, image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=300&q=80' },
    { id: '3', name: 'Thanos Burger', price: 21.20, available: 12, sold: 73, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80' },
    { id: '4', name: 'Chamomile Tea', price: 21.20, available: 24, sold: 6, image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?w=300&q=80' },
    { id: '5', name: 'Neck Burner', price: 21.20, originalPrice: 26.20, available: 5, sold: 12, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80' },
    { id: '6', name: 'Black Tea', price: 21.20, available: 21, sold: 4, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=300&q=80' },
    { id: '7', name: 'Otak Udang', price: 21.20, available: 3, sold: 21, discount: '20% OFF', image: 'https://images.unsplash.com/photo-1599487405270-891961f00880?w=300&q=80' },
    { id: '8', name: 'Mie Sedap', price: 21.20, available: 2, sold: 34, image: 'https://images.unsplash.com/photo-1612929633738-8fe01f72810c?w=300&q=80' }
  ];

  private facade = inject(RestauranteFacade);

  agregarProducto(product: any) {
    // Cuando integras con el backend, agregarías un modal para pedir 'observaciones' si es necesario
    this.facade.agregarProductoAlPedido(
      product.id,
      product.name,
      product.price,
      '' // Observación vacía por defecto
    );
  }
}

