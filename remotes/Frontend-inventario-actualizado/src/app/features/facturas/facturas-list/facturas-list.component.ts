import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { Factura, FACTURAS_MOCK } from '../models/factura.model';
import { FacturaFormModalComponent } from '../components/factura-form-modal/factura-form-modal.component';
import { FacturaExportModalComponent } from '../components/factura-export-modal/factura-export-modal.component';

@Component({
    selector: 'app-facturas-list',
    imports: [CommonModule, FormsModule, RouterModule, LucideIconComponent, FacturaFormModalComponent, FacturaExportModalComponent],
    templateUrl: './facturas-list.component.html',
    styleUrls: ['./facturas-list.component.scss']
})
export class FacturasListComponent {
  facturas = signal<Factura[]>(FACTURAS_MOCK);
  
  // Modals state
  showNuevoModal = signal(false);
  showExportModal = signal(false);

  // Pagination
  currentPage = signal(1);
  itemsPerPage = 5;

  totalFacturas = computed(() => this.facturas().length);
  totalPages = computed(() => Math.ceil(this.totalFacturas() / this.itemsPerPage));

  // KPIs
  totalMonto = computed(() => this.facturas().reduce((acc, f) => acc + f.total, 0));
  pendientes = computed(() => this.facturas().filter(f => f.estado === 'Pendiente').length);

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  }

  // Modal Actions
  openNuevoModal() {
    this.showNuevoModal.set(true);
  }

  closeNuevoModal() {
    this.showNuevoModal.set(false);
  }

  openExportModal() {
    this.showExportModal.set(true);
  }

  closeExportModal() {
    this.showExportModal.set(false);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
