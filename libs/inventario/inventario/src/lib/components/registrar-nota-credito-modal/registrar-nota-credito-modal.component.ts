import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConciliacionGilDiferencia, Factura, MotivoNotaCredito, RegistrarNotaCreditoRequest } from '../../models/facturas.model';

@Component({
  selector: 'inventario-registrar-nota-credito-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-nota-credito-modal.component.html',
  styleUrl: './registrar-nota-credito-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrarNotaCreditoModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() factura: Factura | null = null;
  /** Diferencia SOBREFACTURACION que origina la nota crédito */
  @Input() diferencia: ConciliacionGilDiferencia | null = null;

  @Output() confirmar = new EventEmitter<RegistrarNotaCreditoRequest>();
  @Output() cancelar  = new EventEmitter<void>();

  readonly motivosDisponibles: Array<{ valor: MotivoNotaCredito; etiqueta: string }> = [
    { valor: 'SOBREFACTURACION',  etiqueta: 'Sobre-facturación' },
    { valor: 'DEVOLUCION',        etiqueta: 'Devolución' },
    { valor: 'DESCUENTO',         etiqueta: 'Descuento' },
    { valor: 'ANULACION_PARCIAL', etiqueta: 'Anulación parcial' },
  ];

  motivo        = signal<MotivoNotaCredito>('SOBREFACTURACION');
  fechaEmision  = signal<string>(this.hoy());
  productoId    = signal<string>('');
  cantidad      = signal<number>(0);
  valorUnitario = signal<number>(0);

  valorTotal = computed(() => this.cantidad() * this.valorUnitario());

  ngOnChanges(): void {
    if (this.isOpen && this.diferencia) {
      const dif = this.diferencia;
      const cantidadSobrefacturada = dif.cantidadFactura - (dif.cantidadRecibida ?? dif.cantidadGil);
      this.motivo.set('SOBREFACTURACION');
      this.fechaEmision.set(this.hoy());
      this.productoId.set(dif.gilItemId);
      this.cantidad.set(Math.max(0, cantidadSobrefacturada));
      this.valorUnitario.set(dif.precioUnitarioFactura);
    }
  }

  onMotivo(valor: string): void {
    this.motivo.set(valor as MotivoNotaCredito);
  }

  onFecha(valor: string): void {
    this.fechaEmision.set(valor);
  }

  onCantidad(valor: string): void {
    const n = parseFloat(valor);
    this.cantidad.set(isNaN(n) || n < 0 ? 0 : n);
  }

  onValorUnitario(valor: string): void {
    const n = parseFloat(valor);
    this.valorUnitario.set(isNaN(n) || n < 0 ? 0 : n);
  }

  esValido(): boolean {
    return !!(
      this.factura &&
      this.productoId().trim() &&
      this.cantidad() > 0 &&
      this.valorUnitario() > 0 &&
      this.fechaEmision()
    );
  }

  onConfirmar(): void {
    const f = this.factura;
    if (!f || !this.esValido()) return;

    const req: RegistrarNotaCreditoRequest = {
      facturaId:    String(f.id),
      cufeOrigen:   f.cufe,
      motivo:       this.motivo(),
      fechaEmision: this.fechaEmision(),
      lineas: [
        {
          productoId:    this.productoId(),
          cantidad:      this.cantidad(),
          valorUnitario: this.valorUnitario(),
        },
      ],
    };
    this.confirmar.emit(req);
  }

  onCancelar(): void {
    this.cancelar.emit();
  }

  private hoy(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
