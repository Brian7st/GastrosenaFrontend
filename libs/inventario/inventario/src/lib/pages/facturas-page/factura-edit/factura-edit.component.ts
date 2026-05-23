import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KeywordConfirmModalComponent } from '@restaurant/shared/ui';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { Factura, FacturaItem, ConciliacionItem, MonedaFEL } from '../../../models/facturas.model';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

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
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  factura = this.facade.facturaSeleccionada;
  loading = this.facade.loading;

  // Editable fields (local state)
  nitCliente    = signal('');
  razonSocial   = signal('');
  tipoDoc       = signal('Factura Electrónica');
  fechaEmision  = signal('');
  moneda        = signal<MonedaFEL>('COP');
  notasInternas = signal('');
  localItems    = signal<FacturaItem[]>([]);

  // Modal de confirmación de anulación
  showAnularModal = signal(false);

  isBlocked = computed(() => {
    const f = this.factura();
    return f?.estado === 'VERIFICADA' || f?.estado === 'PAGADA' || f?.estado === 'ANULADA';
  });

  hasConciliacion = computed(() => (this.factura()?.conciliacion?.length ?? 0) > 0);

  constructor() {
    effect(() => {
      const f = this.factura();
      if (f) {
        this.nitCliente.set(f.nitEmisor);
        this.razonSocial.set(f.razonSocial);
        this.tipoDoc.set(f.tipoDocumento);
        this.fechaEmision.set(f.fechaEmision);
        this.moneda.set(f.moneda);
        this.notasInternas.set(f.notasInternas ?? '');
        this.localItems.set([...f.items]);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarFactura(id);
    }
  }

  onVolver(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }

  onExportar(): void {
    // Exportación pendiente de integración HTTP
  }

  onAgregarItem(): void {
    this.localItems.update(items => [
      ...items,
      { descripcion: '', cantidad: 1, precioUnitario: 0, iva: 19, total: 0 },
    ]);
  }

  onEliminarItem(index: number): void {
    this.localItems.update(items => items.filter((_, i) => i !== index));
  }

  onItemChange(index: number, field: keyof FacturaItem, value: string | number): void {
    this.localItems.update(items => {
      const updated = [...items];
      const item = { ...updated[index], [field]: value } as FacturaItem;
      item.total = item.cantidad * item.precioUnitario * (1 + item.iva / 100);
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
    this.facade.actualizarFactura(f.id, {
      nitEmisor: this.nitCliente(),
      razonSocial: this.razonSocial(),
      fechaEmision: this.fechaEmision(),
      moneda: this.moneda(),
      notasInternas: this.notasInternas(),
    });
  }

  getCurrencySymbol(moneda: MonedaFEL): string {
    return moneda === 'GTQ' ? 'Q' : moneda === 'USD' ? '$' : '$';
  }

  formatMoney(value: number, moneda: MonedaFEL): string {
    const sym = this.getCurrencySymbol(moneda);
    return `${sym} ${value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getDiffClass(diff: number): string {
    if (diff < 0) return 'diff--negative';
    if (diff > 0) return 'diff--positive';
    return '';
  }
}
