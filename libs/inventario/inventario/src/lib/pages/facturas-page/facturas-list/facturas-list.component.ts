import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent, DataTableComponent } from '@restaurant/shared/ui';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { Factura, EstadoFactura } from '../../../models/facturas.model';
import { FacturaFormComponent } from '../../../ui/modals/factura-form/factura-form.component';

@Component({
  selector: 'restaurant-facturas-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DataTableComponent, FacturaFormComponent],
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
  showFormModal = signal(false);
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
    this.router.navigate(['/app/inventario/facturas', factura.id], { queryParams: { modo: 'editar' } });
  }

  onAnularFactura(factura: Factura): void {
    console.log('Anular factura:', factura.id);
  }

  onExportar(): void {
    console.log('Exportando facturas...');
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

  formatCurrency(value: number, moneda = 'COP'): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: moneda === 'GTQ' ? 'GTQ' : 'USD',
      minimumFractionDigits: 2,
    }).format(value).replace('US$', '$');
  }
}
