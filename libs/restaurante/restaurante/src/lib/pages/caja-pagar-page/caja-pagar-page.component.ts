import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  PageHeaderComponent,
  ButtonComponent,
  LucideIconComponent,
  ConfirmDialogComponent
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

  alertDialog = signal<{open: boolean, title: string, message: string}>({
    open: false,
    title: '',
    message: ''
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
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado.set(metodo);
    // Auto-completamos el monto para evitar errores visuales
    if (metodo !== 'EFECTIVO') {
      this.montoRecibido.set(this.pedidoSeleccionado()?.subtotal || 0);
    } else {
      this.montoRecibido.set(0);
    }
  }

  actualizarMontoRecibido(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.montoRecibido.set(Number(inputElement.value));
  }

  calcularDevuelta(): number {
    const pedido = this.pedidoSeleccionado();
    if (!pedido) return 0;

    // El Math.round previene el bug de decimales infinitos que bloqueaba el botón
    const devuelta = this.montoRecibido() - pedido.subtotal;
    return Math.round(devuelta * 100) / 100;
  }

  // Lógica blindada: Autoriza el botón sí o sí según el método
  esPagoValido(): boolean {
    const metodo = this.metodoSeleccionado();

    // Si es método electrónico, siempre es válido (botón activado)
    if (metodo === 'TARJETA' || metodo === 'TRANSFERENCIA') {
      return true;
    }

    // Si es efectivo, valida que alcance el dinero
    if (metodo === 'EFECTIVO') {
      return this.calcularDevuelta() >= 0;
    }

    // Si no ha seleccionado nada, se bloquea
    return false;
  }

  confirmarPago() {
    // Doble candado de seguridad antes de enviar al backend
    if (!this.esPagoValido()) return;

    const pedido = this.pedidoSeleccionado();
    const metodo = this.metodoSeleccionado();

    // Mapeo exacto de los Enums que exige tu Spring Boot (TARJETA, TRANSFERENCIA, EFECTIVO)
    let metodoBackend = metodo;

    // Enviamos los parámetros separados tal y como los exige tu Facade
    this.facade.facturarPedido(pedido.id, metodoBackend as MetodoPago, 0);

    this.cerrarModal();

    // Confirmación elegante
    this.alertDialog.set({
      open: true,
      title: 'Pago Procesado',
      message: `El pago del pedido #${pedido.id.substring(0,8).toUpperCase()} se registró correctamente.`
    });
  }

  irAMovimientos() {
    this.alertDialog.set({ ...this.alertDialog(), open: false });
    this.router.navigate(['../movimientos'], { relativeTo: this.route });
  }

  cerrarAlertDialog() {
    this.alertDialog.set({ ...this.alertDialog(), open: false });
  }

  preventInvalidChars(event: KeyboardEvent): void {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }
}