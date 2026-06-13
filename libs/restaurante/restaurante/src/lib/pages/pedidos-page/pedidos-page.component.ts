import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PedidosCategoriesComponent } from '../../components/pedidos-categories/pedidos-categories.component';
import { PedidosMenuGridComponent } from '../../components/pedidos-menu-grid/pedidos-menu-grid.component';
import { PedidosCartComponent } from '../../components/pedidos-cart/pedidos-cart.component';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-pedidos-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PedidosCategoriesComponent,
    PedidosMenuGridComponent,
    PedidosCartComponent,
    LucideIconComponent,
    ButtonComponent
  ],
  templateUrl: './pedidos-page.component.html',
  styleUrls: ['./pedidos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosPageComponent {
  public facade = inject(RestauranteFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchTerm = signal('');
  selectedCategory = signal('all');
  selectedSubcategory = signal('');

  mesaActual = computed(() => {
    const pedido = this.facade.pedidoActivo();
    if (!pedido) return null;
    return this.facade.mesas().find(m => m.id.toString() === pedido.mesaId);
  });

  esPedidoSoloLectura = computed(() => {
    const p = this.facade.pedidoActivo();
    return p ? p.estado !== 'BORRADOR' : false;
  });

  nombreUsuario = this.facade.nombreUsuario;

  fechaActual = new Date();

  volverAMesas() {
    this.router.navigate(['../mesas'], { relativeTo: this.route });
  }
}
