import { ChangeDetectionStrategy, Component, inject, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  @Input() set searchTerm(val: string) {
    this._searchTerm = val.toLowerCase();
  }
  private _searchTerm = '';
  @Input() category: string = 'all';
  @Input() subcategory: string = '';

  // Datos temporales simulando el backend con categorías reales
  private _products = [
    { id: '1', name: 'Coffee Latte', price: 21.20, originalPrice: 26.20, available: 72, sold: 14, discount: '20% OFF', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80', category: 'bebidas', subcategory: 'calientes' },
    { id: '2', name: 'Bolognese Spaghetti', price: 21.20, available: 8, sold: 32, image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=300&q=80', category: 'plato_fuerte' },
    { id: '3', name: 'Thanos Burger', price: 21.20, available: 12, sold: 73, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80', category: 'plato_fuerte' },
    { id: '4', name: 'Chamomile Tea', price: 21.20, available: 24, sold: 6, image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?w=300&q=80', category: 'bebidas', subcategory: 'calientes' },
    { id: '5', name: 'Neck Burner (Alitas)', price: 21.20, originalPrice: 26.20, available: 5, sold: 12, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80', category: 'entrada' },
    { id: '6', name: 'Black Tea', price: 21.20, available: 21, sold: 4, image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=300&q=80', category: 'bebidas', subcategory: 'frias' },
    { id: '7', name: 'Otak Udang', price: 21.20, available: 3, sold: 21, discount: '20% OFF', image: 'https://images.unsplash.com/photo-1599487405270-891961f00880?w=300&q=80', category: 'entrada' },
    { id: '8', name: 'Mie Sedap', price: 21.20, available: 2, sold: 34, image: 'https://images.unsplash.com/photo-1612929633738-8fe01f72810c?w=300&q=80', category: 'plato_fuerte' },
    { id: '9', name: 'Pastel de Chocolate', price: 15.00, available: 10, sold: 25, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80', category: 'postre' },
    { id: '10', name: 'Margarita Clásica', price: 30.00, available: 50, sold: 100, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&q=80', category: 'bebidas', subcategory: 'con_alcohol' },
    { id: '11', name: 'Jugo Natural', price: 10.00, available: 30, sold: 50, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&q=80', category: 'bebidas', subcategory: 'sin_alcohol' }
  ];

  get products() {
    let filtered = this._products;

    if (this.category && this.category !== 'all') {
      filtered = filtered.filter(p => p.category === this.category);
    }

    if (this.subcategory) {
      filtered = filtered.filter(p => p.subcategory === this.subcategory);
    }

    if (this._searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(this._searchTerm));
    }

    return filtered;
  }

  private facade = inject(RestauranteFacade);
  private router = inject(Router);

  agregarProducto(product: any) {
    if (!this.facade.pedidoActivo()) {
      alert('Atención: Debes tener una mesa asignada para poder agregar productos al pedido.');
      this.router.navigate(['/restaurante/mesas']);
      return;
    }

    // Cuando integras con el backend, agregarías un modal para pedir 'observaciones' si es necesario
    this.facade.agregarProductoAlPedido(
      product.id,
      product.name,
      product.price,
      '' // Observación vacía por defecto
    );
  }
}

