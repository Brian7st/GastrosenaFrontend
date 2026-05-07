import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { ExportarConsolidadoModalComponent } from '../components/exportar-consolidado-modal/exportar-consolidado-modal.component';
import { ReversarConsolidadoModalComponent } from '../components/reversar-consolidado-modal/reversar-consolidado-modal.component';

interface Consolidado {
  id: string;
  mes: string;
  tipo: string;
  total: string;
  estado: string;
  variant: 'success' | 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'restaurant-consolidado-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, KpiCardComponent, StatusBadgeComponent, ExportarConsolidadoModalComponent, ReversarConsolidadoModalComponent],
  templateUrl: './consolidado-list.component.html',
  styleUrl: './consolidado-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidadoListComponent {
  private router = inject(Router);

  showExportModal = false;
  showReversarModal = false;
  selectedReversarItem: Consolidado | null = null;
  isReversarBlocked = false;

  openExportModal() {
    this.showExportModal = true;
  }

  closeExportModal() {
    this.showExportModal = false;
  }

  onExport(format: 'excel' | 'pdf') {
    console.log('Exporting as', format);
    // Add real export logic here
    this.showExportModal = false;
  }

  // Mocks para la tabla de consolidados históricos
  consolidados: Array<Consolidado> = [
    { id: '#CON-2023-12-01', mes: 'Diciembre 2023', tipo: 'Cierre Anual', total: '$45,200,000.00', estado: 'Contabilizado', variant: 'success' },
    { id: '#CON-2023-11-28', mes: 'Noviembre 2023', tipo: 'Regular', total: '$38,150,000.00', estado: 'Generado', variant: 'info' },
    { id: '#CON-2023-10-15', mes: 'Octubre 2023', tipo: 'Regular', total: '$29,400,000.00', estado: 'Borrador', variant: 'warning' },
    { id: '#CON-2023-09-30', mes: 'Septiembre 2023', tipo: 'Regular', total: '$41,200,000.00', estado: 'Contabilizado', variant: 'success' }
  ];

  goToDetail(id: string) {
    // Navigate to the detail view based on ID
    this.router.navigate(['/app/inventario/consolidado', id.replace('#', '')]);
  }

  reversar(id: string) {
    const item = this.consolidados.find(c => c.id === id);
    if (item) {
      this.selectedReversarItem = item;
      // Mock logic: block if variant is 'success' (e.g. Contabilizado) just to show both modals for demo.
      this.isReversarBlocked = item.variant === 'success';
      this.showReversarModal = true;
    }
  }

  closeReversarModal() {
    this.showReversarModal = false;
    this.selectedReversarItem = null;
  }

  confirmReversar() {
    if (this.selectedReversarItem) {
      this.selectedReversarItem.estado = 'Reversado';
      this.selectedReversarItem.variant = 'danger';
      // Force change detection by re-assigning array if needed, but OnPush might require it:
      this.consolidados = [...this.consolidados];
    }
    this.closeReversarModal();
  }
}
