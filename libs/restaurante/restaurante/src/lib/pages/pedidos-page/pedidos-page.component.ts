import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidosCategoriesComponent } from '../../components/pedidos-categories/pedidos-categories.component';
import { PedidosMenuGridComponent } from '../../components/pedidos-menu-grid/pedidos-menu-grid.component';
import { PedidosCartComponent } from '../../components/pedidos-cart/pedidos-cart.component';
import { RestauranteFacade } from '../../data-access/restaurante.facade';

@Component({
  selector: 'lib-pedidos-page',
  standalone: true,
  imports: [
    CommonModule,
    PedidosCategoriesComponent,
    PedidosMenuGridComponent,
    PedidosCartComponent
  ],
  templateUrl: './pedidos-page.component.html',
  styleUrls: ['./pedidos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosPageComponent implements OnInit {
  public facade = inject(RestauranteFacade);
  private router = inject(Router);

  ngOnInit() {
    if (!this.facade.pedidoActivo()) {
      // Si no hay pedido activo, redirigir a la vista de mesas
      this.router.navigate(['/restaurante/mesas']);
    }
  }
}
