import { ChangeDetectionStrategy, Component, inject, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { ProductoMenu } from '../../data-access/restaurante.facade';

import { CardComponent, StatusBadgeComponent, ConfirmDialogComponent } from '@restaurant/shared/ui';
import { CurrencyCopPipe } from '@restaurant/shared/util';

@Component({
  selector: 'lib-pedidos-menu-grid',
  standalone: true,
  imports: [CommonModule, CardComponent, StatusBadgeComponent, ConfirmDialogComponent, CurrencyCopPipe],
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

  private facade = inject(RestauranteFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public showNoTableModal = signal(false);

  get products() {
    let filtered = this.facade.productosMenu();

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

  agregarProducto(product: any) {
    if (!this.facade.pedidoActivo()) {
      this.showNoTableModal.set(true);
      return;
    }

    const categoriaMapped = product.category === 'bebidas' ? 'BEBIDA' : 'COMIDA';

    this.facade.agregarProductoAlPedido(
      product.id,
      product.name,
      product.price,
      categoriaMapped,
      ''
    );
  }

  irAMesas() {
    this.showNoTableModal.set(false);
    this.router.navigate(['../mesas'], { relativeTo: this.route });
  }
}

