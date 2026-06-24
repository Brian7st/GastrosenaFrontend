import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KeywordConfirmModalComponent } from '@restaurant/shared/ui';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { FacturaLinea } from '../../../models/facturas.model';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ActualizarFacturaRequest } from '../../../data-access/api/sourcing.api';
import type { InfoBancariaTipo } from '../../../data-access/api/sourcing.api';

@Component({
  selector: 'restaurant-factura-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent, KeywordConfirmModalComponent],
  templateUrl: './factura-edit.component.html',
  styleUrl: './factura-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaEditPageComponent implements OnInit {
  private facade = inject(FacturasFacade);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  factura = this.facade.facturaSeleccionada;
  loading = this.facade.loading;

  nitCliente = signal('');
  proveedorNombre = signal('');
  cufe = signal('');
  fechaEmision = signal('');
  fechaRecepcion = signal('');
  proveedorBeneficiarioZese = signal(false);
  ordenCompra = signal('');
  banco = signal('');
  numeroCuenta = signal('');
  tipoCuenta = signal<InfoBancariaTipo | ''>('');
  localItems = signal<FacturaLinea[]>([]);

  showAnularModal = signal(false);

  isBlocked = computed(() => {
    const f = this.factura();
    return f?.estado === 'VERIFICADA' || f?.estado === 'PAGADA' || f?.estado === 'ANULADA';
  });

  hasConciliacion = computed(() => false);

  constructor() {
    effect(() => {
      const f = this.factura();
      if (!f) return;
      this.nitCliente.set(f.proveedorNit);
      this.proveedorNombre.set(f.proveedorNombre);
      this.cufe.set(f.cufe);
      this.fechaEmision.set(f.fechaEmision);
      this.fechaRecepcion.set(f.fechaRecepcion ?? '');
      this.proveedorBeneficiarioZese.set(Boolean(f.proveedorBeneficiarioZese));
      this.ordenCompra.set(f.ordenCompra ?? '');
      this.banco.set(f.infoBancariaBanco ?? '');
      this.numeroCuenta.set(f.infoBancariaCuenta ?? '');
      this.tipoCuenta.set(f.infoBancariaTipo ?? '');
      this.localItems.set(
        f.lineas.map((item) => ({
          ...item,
          porcentajeIva: item.porcentajeIva ?? item.iva,
          iva: item.porcentajeIva ?? item.iva,
        })),
      );
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.facade.cargarFactura(id);
  }

  onVolver(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }

  onAgregarItem(): void {
    this.localItems.update((items) => [
      ...items,
      { descripcion: '', cantidad: 1, precioUnitario: 0, porcentajeIva: 19, iva: 19, total: 0 },
    ]);
  }

  onEliminarItem(index: number): void {
    this.localItems.update((items) => items.filter((_, i) => i !== index));
  }

  onItemChange(index: number, field: keyof FacturaLinea, value: string | number): void {
    this.localItems.update((items) => {
      const updated = [...items];
      const item = { ...updated[index], [field]: value } as FacturaLinea;
      if (field === 'iva' || field === 'porcentajeIva') {
        item.iva = Number(value);
        item.porcentajeIva = Number(value);
      }
      const iva = item.porcentajeIva ?? item.iva ?? 0;
      item.total = item.cantidad * item.precioUnitario * (1 + iva / 100);
      updated[index] = item;
      return updated;
    });
  }

  onAnular(): void {
    this.showAnularModal.set(true);
  }

  onConfirmarAnular(): void {
    const id = this.factura()?.id;
    if (id) this.facade.anularFactura(id);
    this.showAnularModal.set(false);
    this.onVolver();
  }

  onCancelarAnular(): void {
    this.showAnularModal.set(false);
  }

  onGuardar(): void {
    const f = this.factura();
    if (!f) return;
    const payload: ActualizarFacturaRequest = {
      numeroFactura: f.numeroFactura,
      cufe: this.cufe(),
      proveedorNit: this.nitCliente(),
      proveedorNombre: this.proveedorNombre(),
      proveedorBeneficiarioZese: this.proveedorBeneficiarioZese(),
      fechaEmision: this.fechaEmision(),
      fechaRecepcion: this.fechaRecepcion(),
      ordenCompra: this.ordenCompra() || undefined,
      infoBancariaBanco: this.banco() || undefined,
      infoBancariaCuenta: this.numeroCuenta() || undefined,
      infoBancariaTipo: this.tipoCuenta() || undefined,
      lineas: this.localItems().map((item) => ({
        productoId: item.productoId,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        porcentajeIva: item.porcentajeIva ?? item.iva,
      })),
    };
    this.facade.actualizarFactura(f.id, payload);
  }

  formatMoney(value: number): string {
    return `$ ${value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getDiffClass(diff: number): string {
    if (diff < 0) return 'diff--negative';
    if (diff > 0) return 'diff--positive';
    return '';
  }
}
