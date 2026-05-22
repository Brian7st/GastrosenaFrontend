import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent, KeywordConfirmModalComponent } from '@restaurant/shared/ui';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { Factura, EstadoFactura } from '../../../models/facturas.model';
import { FacturaFormComponent } from '../../../ui/modals/factura-form/factura-form.component';

@Component({
  selector: 'restaurant-facturas-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DataTableComponent, KpiCardComponent, FacturaFormComponent, KeywordConfirmModalComponent],
  templateUrl: './facturas-list.component.html',
  styleUrl: './facturas-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturasListPageComponent implements OnInit {
  private facade = inject(FacturasFacade);
  private router = inject(Router);

  // State
  facturas = this.facade.facturas;
  kpis = this.facade.kpis;
  loading = this.facade.loading;

  // Modal controls
  showFormModal    = signal(false);
  showAnularModal  = signal(false);
  facturaParaAnular = signal<Factura | null>(null);
  searchQuery = signal('');

  ngOnInit(): void {
    this.facade.loadAll();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.facade.setFiltros({ busqueda: query });
  }

  onNuevaFactura(): void {
    this.showFormModal.set(true);
  }

  onCloseForm(): void {
    this.showFormModal.set(false);
  }

  onSaveFactura(data: Partial<Factura>): void {
    this.facade.crearFactura(data);
    this.showFormModal.set(false);
  }

  onVerFactura(factura: Factura): void {
    this.router.navigate(['/app/inventario/facturas', factura.id]);
  }

  onEditarFactura(factura: Factura): void {
    this.router.navigate(['/app/inventario/facturas', factura.id, 'editar']);
  }

  onAnularFactura(factura: Factura): void {
    this.facturaParaAnular.set(factura);
    this.showAnularModal.set(true);
  }

  onConfirmarAnular(): void {
    const factura = this.facturaParaAnular();
    if (factura) this.facade.anularFactura(factura.id);
    this.showAnularModal.set(false);
    this.facturaParaAnular.set(null);
  }

  onCancelarAnular(): void {
    this.showAnularModal.set(false);
    this.facturaParaAnular.set(null);
  }

  onImportar(): void {
    this.router.navigate(['/app/inventario/facturas/importar']);
  }

  onExportar(): void {
    // TODO: ruta de exportación pendiente
  }

  getEstadoBadgeClass(estado: EstadoFactura): string {
    const map: Record<EstadoFactura, string> = {
      Registrada: 'status-badge--registrada',
      Verificada: 'status-badge--verificada',
      Pagada:     'status-badge--pagada',
      Anulada:    'status-badge--anulada',
    };
    return map[estado] ?? 'status-badge--default';
  }

  getProveedorIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  getDocumentoIcono(tipoDocumento: string): string {
    const map: Record<string, string> = {
      'Factura Electrónica': 'receipt_long',
      'Factura':             'receipt_long',
      'Nota Crédito':        'note_alt',
      'Nota Débito':         'note_add',
      'Orden de Compra':     'shopping_cart',
    };
    return map[tipoDocumento] ?? 'description';
  }

  formatCurrency(value: number, moneda = 'COP'): string {
    const validCurrency = moneda === 'GTQ' ? 'GTQ' : (moneda === 'USD' ? 'USD' : 'COP');
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 2,
    }).format(value).replace('US$', '$');
  }
}
