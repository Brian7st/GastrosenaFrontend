import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { ButtonComponent, LucideIconComponent, ConfirmDialogComponent } from '@restaurant/shared/ui';
import { CurrencyCopPipe } from '@restaurant/shared/util';

@Component({
  selector: 'lib-pedidos-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, LucideIconComponent, ConfirmDialogComponent, CurrencyCopPipe],
  templateUrl: './pedidos-cart.component.html',
  styleUrls: ['./pedidos-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosCartComponent {
  private facade = inject(RestauranteFacade);
  private router = inject(Router);

  pedidoActivo = this.facade.pedidoActivo;
  observacionesGenerales = signal('');
  showCancelModal = signal(false);
  showConfirmModal = signal(false);

  incrementar(index: number) {
    this.facade.actualizarCantidadProducto(index, 1);
  }

  decrementar(index: number) {
    this.facade.actualizarCantidadProducto(index, -1);
  }

  eliminarItem(index: number) {
    this.facade.eliminarProductoDelPedido(index);
  }

  iniciarCancelacion() {
    this.showCancelModal.set(true);
  }

  ejecutarCancelacion() {
    this.showCancelModal.set(false);
    
    const pedido = this.pedidoActivo();
    if (pedido?.mesaId) {
      // Liberar la mesa si se cancela el pedido en borrador
      this.facade.liberarMesa(pedido.mesaId);
    }
    
    this.facade.limpiarPedidoActivo();
    this.router.navigate(['/restaurante/mesas']);
  }

  iniciarConfirmacion() {
    this.showConfirmModal.set(true);
  }

  ejecutarConfirmacion() {
    this.showConfirmModal.set(false);
    this.facade.confirmarPedidoActivo(this.observacionesGenerales());
    this.router.navigate(['/restaurante/mesas']);
  }
}

