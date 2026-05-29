import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { ButtonComponent, LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'lib-pedidos-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, LucideIconComponent],
  templateUrl: './pedidos-cart.component.html',
  styleUrls: ['./pedidos-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosCartComponent {
  private facade = inject(RestauranteFacade);
  private router = inject(Router);

  pedidoActivo = this.facade.pedidoActivo;
  observacionesGenerales = signal('');

  incrementar(index: number) {
    this.facade.actualizarCantidadProducto(index, 1);
  }

  decrementar(index: number) {
    this.facade.actualizarCantidadProducto(index, -1);
  }

  confirmarPedido() {
    this.facade.confirmarPedidoActivo(this.observacionesGenerales());
    this.router.navigate(['/restaurante/mesas']);
  }
}

