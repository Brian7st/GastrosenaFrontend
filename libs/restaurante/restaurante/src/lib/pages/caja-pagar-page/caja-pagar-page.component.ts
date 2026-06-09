import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  PageHeaderComponent,
  ButtonComponent,
  LucideIconComponent,
  ConfirmDialogComponent,
  DataTableComponent,
  EmptyStateComponent
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { MetodoPago } from '../../models/restaurante.model';

@Component({
  selector: 'restaurant-caja-pagar-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ButtonComponent,
    LucideIconComponent,
    ConfirmDialogComponent,
    DataTableComponent,
    EmptyStateComponent,
    CurrencyPipe
  ],
  templateUrl: './caja-pagar-page.component.html',
  styleUrl: './caja-pagar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaPagarPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public facade = inject(RestauranteFacade);

  pedidosPorPagar = computed(() => this.facade.pedidosParaCobro());

  modalAbierto = signal<boolean>(false);
  pedidoSeleccionado = signal<any | null>(null);
  metodoSeleccionado = signal<string>('');
  montoRecibido = signal<number>(0);

  alertDialog = signal<{ open: boolean, title: string, message: string, success: boolean }>({
    open: false,
    title: '',
    message: '',
    success: false
  });

  facturaRecienPagadaId = signal<string | null>(null);

  // --- Estados de Propina ---
  tipoPropina = signal<'NADA' | 'DIEZ_PORCIENTO' | 'OTRO'>('NADA');
  propinaManual = signal<number | null>(null);

  propinaCalculada = computed(() => {
    const tipo = this.tipoPropina();
    if (tipo === 'NADA') return 0;
    
    const pedido = this.pedidoSeleccionado();
    const subtotal = pedido ? pedido.subtotal : 0;
    
    if (tipo === 'DIEZ_PORCIENTO') return subtotal * 0.10;
    if (tipo === 'OTRO') return this.propinaManual() || 0;
    
    return 0;
  });

  totalACobrar = computed(() => {
    const pedido = this.pedidoSeleccionado();
    if (!pedido) return 0;
    return pedido.subtotal + this.propinaCalculada();
  });

  ngOnInit() {
    this.facade.cargarPedidosParaCobro();
  }

  volver() {
    this.router.navigate(['/app/restaurante/caja']);
  }

  abrirCobro(pedido: any) {
    this.pedidoSeleccionado.set(pedido);
    this.metodoSeleccionado.set('');
    this.montoRecibido.set(0);
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.pedidoSeleccionado.set(null);
    this.metodoSeleccionado.set('');
    this.montoRecibido.set(0);
    this.tipoPropina.set('NADA');
    this.propinaManual.set(null);
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado.set(metodo);
    // Auto-completamos el monto para evitar errores visuales
    if (metodo !== 'EFECTIVO') {
      this.montoRecibido.set(this.totalACobrar());
    } else {
      this.montoRecibido.set(0);
    }
  }

  actualizarMontoRecibido(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.montoRecibido.set(Number(inputElement.value));
  }

  calcularDevuelta(): number {
    const recibido = this.montoRecibido();
    const total = this.totalACobrar();
    if (!recibido || !total) return 0;
    const devuelta = recibido - total;
    return Math.round(devuelta * 100) / 100;
  }

  seleccionarTipoPropina(tipo: 'NADA' | 'DIEZ_PORCIENTO' | 'OTRO') {
    this.tipoPropina.set(tipo);
    if (tipo !== 'OTRO') {
      this.propinaManual.set(null);
    }
  }

  actualizarPropinaManual(event: any) {
    const value = parseFloat(event.target.value);
    this.propinaManual.set(isNaN(value) ? null : value);
  }

  // Lógica blindada: Autoriza el botón sí o sí según el método
  esPagoValido(): boolean {
    const metodo = this.metodoSeleccionado();
    if (!metodo) return false;

    if (metodo === 'EFECTIVO') {
      const monto = this.montoRecibido();
      const total = this.totalACobrar();
      if (!monto || monto < total) {
        return false;
      }
    }

    return true;
  }

  confirmarPago() {
    if (!this.esPagoValido()) return;

    const pedido = this.pedidoSeleccionado();
    const metodo = this.metodoSeleccionado();
    let metodoBackend = metodo;

    this.facade.facturarPedido(pedido.id, metodoBackend as MetodoPago, this.propinaCalculada()).subscribe({
      next: (facturaId) => {
        this.cerrarModal();
        if (facturaId) {
          this.facturaRecienPagadaId.set(facturaId);
          this.alertDialog.set({
            open: true,
            title: 'Pago Procesado',
            message: `El pago del pedido #${pedido.id.substring(0, 8).toUpperCase()} se registró correctamente.`,
            success: true
          });
        } else {
          this.alertDialog.set({
            open: true,
            title: 'Error de Pago',
            message: 'No se pudo obtener el número de factura. Verifique en Movimientos.',
            success: false
          });
        }
      }
    });
  }

  irAMovimientos() {
    this.alertDialog.set({ ...this.alertDialog(), open: false });
    this.router.navigate(['../movimientos'], { relativeTo: this.route });
  }

  descargarTirillaYCerrar() {
    const id = this.facturaRecienPagadaId();
    if (id) {
      this.facade.descargarFacturaPdf(id);
    }
    this.cerrarAlertDialog();
  }

  cerrarAlertDialog() {
    this.alertDialog.set({ ...this.alertDialog(), open: false });
    this.facturaRecienPagadaId.set(null);
  }

  preventInvalidChars(event: KeyboardEvent): void {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }
}