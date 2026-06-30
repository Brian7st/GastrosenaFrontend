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
  
  errorModalVisible = signal(false);
  errorMessage = signal('');
  motivoAnulacion = signal('');
  motivoDevolucion = signal('');
  motivoItem = signal('');
  
  itemAccionActual = signal<{id: string, nombre: string, tipo: 'CANCELAR' | 'DEVOLVER', maxCantidad: number} | null>(null);
  cantidadItemAccion = signal<number>(1);

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
      next: (res) => {
        if (res.exito) {
          this.motivoAnulacion.set('');
          this.router.navigate(['/app/restaurante/mesas']);
        } else {
          this.mostrarError(res.mensaje || 'Error al cancelar el pedido');
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
      next: (res) => {
        if (res.exito) {
          this.motivoDevolucion.set('');
          this.router.navigate(['/app/restaurante/mesas']);
        } else {
          this.mostrarError(res.mensaje || 'Error al devolver el pedido');
        }
      }
    });
  }

  iniciarAccionItem(id: string | undefined, nombre: string, tipo: 'CANCELAR' | 'DEVOLVER', maxCantidad: number) {
    if (!id) return;
    this.itemAccionActual.set({ id, nombre, tipo, maxCantidad });
    this.motivoItem.set('');
    this.cantidadItemAccion.set(maxCantidad);
    this.showItemActionModal.set(true);
  }

  incrementarCantidadAccion() {
    const accion = this.itemAccionActual();
    if (accion && this.cantidadItemAccion() < accion.maxCantidad) {
      this.cantidadItemAccion.update(c => c + 1);
    }
  }

  decrementarCantidadAccion() {
    if (this.cantidadItemAccion() > 1) {
      this.cantidadItemAccion.update(c => c - 1);
    }
  }

  ejecutarAccionItem() {
    const accion = this.itemAccionActual();
    if (!accion) return;
    
    const motivo = this.motivoItem();
    if (!motivo.trim()) return;

    const cantidad = this.cantidadItemAccion();

    this.showItemActionModal.set(false);

    if (accion.tipo === 'CANCELAR') {
      this.facade.cancelarItemPedido(accion.id, motivo, cantidad).subscribe({
        next: (res) => {
          if (res.exito) {
            this.limpiarAccionItem();
          } else {
            this.mostrarError(res.mensaje || 'Error al cancelar el ítem');
          }
        }
      });
    } else {
      this.facade.devolverItemPedido(accion.id, motivo, cantidad).subscribe({
        next: (res) => {
          if (res.exito) {
            this.limpiarAccionItem();
          } else {
            this.mostrarError(res.mensaje || 'Error al devolver el ítem');
          }
        }
      });
    }
  }

  limpiarAccionItem() {
    this.itemAccionActual.set(null);
    this.motivoItem.set('');
    this.cantidadItemAccion.set(1);
    this.showItemActionModal.set(false);
  }

  getEstadoDetalleClass(estado?: string): string {
    if (!estado) return 'estado-pendiente';
    switch (estado.toUpperCase()) {
      case 'PREPARANDO': return 'estado-preparando';
      case 'TERMINADO': return 'estado-terminado';
      case 'CANCELADO': return 'estado-cancelado';
      case 'EN_DEVOLUCION': return 'estado-cancelado';
      case 'DEVUELTO': return 'estado-cancelado';
      default: return 'estado-pendiente';
    }
  }

  getEstadoDetalleText(estado?: string): string {
    if (!estado) return 'Pendiente';
    const cleanEstado = estado.replace('_', ' ');
    return cleanEstado.charAt(0).toUpperCase() + cleanEstado.slice(1).toLowerCase();
  }

  mostrarError(mensaje: string) {
    this.errorMessage.set(mensaje);
    this.errorModalVisible.set(true);
  }

  cerrarErrorModal() {
    this.errorModalVisible.set(false);
    this.errorMessage.set('');
  }
}

