import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent, KeywordConfirmModalComponent } from '@restaurant/shared/ui';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { Factura, EstadoFactura } from '../../../models/facturas.model';
import { ExportarComponent } from '../../../components/exportar/exportar.component';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';

@Component({
  selector: 'restaurant-facturas-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DataTableComponent, KpiCardComponent, KeywordConfirmModalComponent, ExportarComponent, EmptyStateComponent],
  templateUrl: './facturas-list.component.html',
  styleUrl: './facturas-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturasListPageComponent implements OnInit {
  private facade = inject(FacturasFacade);
  private router = inject(Router);

  // State
  facturas   = this.facade.facturas;
  kpis       = this.facade.kpis;
  loading    = this.facade.loading;
  paginacion = this.facade.paginacion;
  paginas    = computed(() => Array.from({ length: this.paginacion().totalPages }, (_, i) => i));

  // Filter panel
  showFilters       = signal(false);
  filtroEstado      = signal<EstadoFactura | ''>('');
  filtroProveedor   = signal('');

  filtrosActivos = computed(() => {
    let count = 0;
    if (this.filtroEstado())    count++;
    if (this.filtroProveedor()) count++;
    return count;
  });

  // Modal controls
  showAnularModal    = signal(false);
  showExportarModal  = signal(false);
  facturaParaAnular  = signal<Factura | null>(null);
  searchQuery        = signal('');

  ngOnInit(): void {
    this.facade.loadAll();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.facade.setFiltros({ busqueda: query });
  }

  onToggleFilters(): void {
    this.showFilters.update(v => !v);
  }

  onFiltroEstadoChange(estado: string): void {
    this.filtroEstado.set(estado as EstadoFactura | '');
    this.facade.setFiltros({ estado: (estado as EstadoFactura) || undefined });
  }

  onFiltroProveedorChange(value: string): void {
    this.filtroProveedor.set(value);
    this.facade.setFiltros({ proveedor: value || undefined });
  }

  onLimpiarFiltros(): void {
    this.filtroEstado.set('');
    this.filtroProveedor.set('');
    this.facade.setFiltros({
      busqueda:  undefined,
      estado:    undefined,
      proveedor: undefined,
    });
  }

  onIrAPagina(page: number): void {
    this.facade.irAPagina(page);
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
    this.showExportarModal.set(true);
  }

  onConfirmarExportar(formato: string): void {
    // TODO: integrar con servicio de descarga cuando backend confirme contrato
    console.info('[FEL] Exportar en formato:', formato);
    this.showExportarModal.set(false);
  }

  onCerrarExportar(): void {
    this.showExportarModal.set(false);
  }

  getEstadoBadgeClass(estado: EstadoFactura): string {
    const map: Record<EstadoFactura, string> = {
      REGISTRADA: 'status-badge--registrada',
      VERIFICADA: 'status-badge--verificada',
      PAGADA:     'status-badge--pagada',
      ANULADA:    'status-badge--anulada',
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
