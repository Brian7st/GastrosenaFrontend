import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { ButtonComponent, LucideIconComponent, ConfirmDialogComponent } from '@restaurant/shared/ui';
import { CurrencyCopPipe } from '@restaurant/shared/util';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'lib-pedidos-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, LucideIconComponent, ConfirmDialogComponent, CurrencyCopPipe],
  templateUrl: './pedidos-cart.component.html',
  styleUrls: ['./pedidos-cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosCartComponent {
  protected readonly i18n = inject(I18nService);
  private facade = inject(RestauranteFacade);
  private router = inject(Router);

  pedidoActivo = this.facade.pedidoActivo;
  
  comidasPedido = computed(() => {
    const pedido = this.pedidoActivo();
    return pedido ? pedido.detalles.filter(d => {
      const cat = (d.categoria || '').toLowerCase();
      return cat !== 'bebidas' && cat !== 'bebida';
    }) : [];
  });

  bebidasPedido = computed(() => {
    const pedido = this.pedidoActivo();
    return pedido ? pedido.detalles.filter(d => {
      const cat = (d.categoria || '').toLowerCase();
      return cat === 'bebidas' || cat === 'bebida';
    }) : [];
  });

  observacionesGenerales = signal('');
  showCancelModal = signal(false);
  showConfirmModal = signal(false);
  showAnularBackendModal = signal(false);
  showEmptyCartModal = signal(false);
  showDevolverBackendModal = signal(false);
  showItemActionModal = signal(false);
  
  motivoAnulacion = signal('');
  motivoDevolucion = signal('');
  motivoItem = signal('');
  
  itemAccionActual = signal<{id: string, nombre: string, tipo: 'CANCELAR' | 'DEVOLVER'} | null>(null);

  editIndex = signal<number | null>(null);
  tempObservacion = signal<string>('');

  esPedidoSoloLectura = computed(() => {
    const p = this.pedidoActivo();
    return p ? p.estado !== 'BORRADOR' : false;
  });

  estadoPedido = computed(() => {
    return this.pedidoActivo()?.estado || 'BORRADOR';
  });

  incrementar(index: number) {
    this.facade.actualizarCantidadProducto(index, 1);
  }

  decrementar(index: number) {
    this.facade.actualizarCantidadProducto(index, -1);
  }

  eliminarItem(index: number) {
    this.facade.eliminarProductoDelPedido(index);
  }

  iniciarEdicionObservacion(index: number, currentObs: string) {
    this.editIndex.set(index);
    this.tempObservacion.set(currentObs || '');
  }

  guardarObservacion() {
    const index = this.editIndex();
    if (index !== null) {
      this.facade.actualizarObservacionesProducto(index, this.tempObservacion().trim());
      this.editIndex.set(null);
    }
  }

  cancelarEdicionObservacion() {
    this.editIndex.set(null);
  }

  iniciarCancelacion() {
    this.showCancelModal.set(true);
  }

  ejecutarCancelacion() {
    this.showCancelModal.set(false);
    this.facade.vaciarCarrito();
    this.observacionesGenerales.set('');
  }

  iniciarConfirmacion() {
    const pedido = this.pedidoActivo();
    if (!pedido || !pedido.detalles || pedido.detalles.length === 0) {
      this.showEmptyCartModal.set(true);
      return;
    }
    this.showConfirmModal.set(true);
  }

  ejecutarConfirmacion() {
    this.showConfirmModal.set(false);
    this.facade.confirmarPedidoActivo(this.observacionesGenerales()).subscribe({
      next: (exito) => {
        if (exito) {
          this.router.navigate(['/app/restaurante/mesas']);
        }
      }
    });
  }

  iniciarAnulacionBackend() {
    this.showAnularBackendModal.set(true);
  }

  ejecutarAnulacionBackend() {
    if (!this.motivoAnulacion().trim()) return;
    this.showAnularBackendModal.set(false);
    this.facade.cancelarPedidoActivoEnBackend(this.motivoAnulacion()).subscribe({
      next: (exito) => {
        if (exito) {
          this.motivoAnulacion.set('');
          this.router.navigate(['/app/restaurante/mesas']);
        }
      }
    });
  }

  iniciarDevolucionBackend() {
    this.showDevolverBackendModal.set(true);
  }

  ejecutarDevolucionBackend() {
    if (!this.motivoDevolucion().trim()) return;
    this.showDevolverBackendModal.set(false);
    this.facade.devolverPedidoActivoEnBackend(this.motivoDevolucion()).subscribe({
      next: (exito) => {
        if (exito) {
          this.motivoDevolucion.set('');
          this.router.navigate(['/app/restaurante/mesas']);
        }
      }
    });
  }

  iniciarAccionItem(id: string | undefined, nombre: string, tipo: 'CANCELAR' | 'DEVOLVER') {
    if (!id) return;
    this.itemAccionActual.set({ id, nombre, tipo });
    this.motivoItem.set('');
    this.showItemActionModal.set(true);
  }

  ejecutarAccionItem() {
    const accion = this.itemAccionActual();
    if (!accion) return;
    
    const motivo = this.motivoItem();
    if (!motivo.trim()) return;

    this.showItemActionModal.set(false);

    if (accion.tipo === 'CANCELAR') {
      this.facade.cancelarItemPedido(accion.id, motivo).subscribe({
        next: (exito) => {
          if (exito) this.limpiarAccionItem();
        }
      });
    } else {
      this.facade.devolverItemPedido(accion.id, motivo).subscribe({
        next: (exito) => {
          if (exito) this.limpiarAccionItem();
        }
      });
    }
  }

  limpiarAccionItem() {
    this.itemAccionActual.set(null);
    this.motivoItem.set('');
    this.showItemActionModal.set(false);
  }
}

