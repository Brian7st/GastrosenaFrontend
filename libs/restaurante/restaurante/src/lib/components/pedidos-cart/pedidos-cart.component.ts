import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestauranteFacade } from '../../data-access/restaurante.facade';

@Component({
  selector: 'lib-pedidos-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos-cart.component.html',
  styleUrls: ['./pedidos-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosCartComponent {
  private facade = inject(RestauranteFacade);

  pedidoActivo = this.facade.pedidoActivo;

  incrementar(index: number) {
    this.facade.actualizarCantidadProducto(index, 1);
  }

  decrementar(index: number) {
    this.facade.actualizarCantidadProducto(index, -1);
  }

  confirmarPedido() {
    this.facade.confirmarPedidoActivo();
  }
}

