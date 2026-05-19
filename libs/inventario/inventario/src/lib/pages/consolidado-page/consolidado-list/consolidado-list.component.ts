import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { ExportarConsolidadoModalComponent } from '../components/exportar-consolidado-modal/exportar-consolidado-modal.component';
import { ReversarConsolidadoModalComponent } from '../components/reversar-consolidado-modal/reversar-consolidado-modal.component';
import { Consolidado, ConsolidadoMock } from '../../../models/consolidado.model';

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

  showExportModal = signal(false);
  showReversarModal = signal(false);
  selectedReversarItem = signal<Consolidado | null>(null);
  isReversarBlocked = signal(false);

  openExportModal() {
    this.showExportModal.set(true);
  }

  closeExportModal() {
    this.showExportModal.set(false);
  }

  onExport(format: 'excel' | 'pdf') {
    console.log('Exporting as', format);
    // Add real export logic here
    this.showExportModal.set(false);
  }

  // Mocks para la tabla de consolidados históricos
  consolidados = signal<Consolidado[]>(ConsolidadoMock);

  goToDetail(id: string) {
    // Navigate to the detail view based on ID
    this.router.navigate(['/app/inventario/consolidado', id.replace('#', '')]);
  }

  reversar(id: string) {
    const item = this.consolidados().find(c => c.id === id);
    if (item) {
      this.selectedReversarItem.set(item);
      // Mock logic: block if variant is 'success' (e.g. Contabilizado) just to show both modals for demo.
      this.isReversarBlocked.set(item.variant === 'success');
      this.showReversarModal.set(true);
    }
  }

  closeReversarModal() {
    this.showReversarModal.set(false);
    this.selectedReversarItem.set(null);
  }

  confirmReversar() {
    if (this.selectedReversarItem()) {
      this.consolidados.update(list => list.map(c => c.id === this.selectedReversarItem()!.id ? { ...c, estado: 'Reversado', variant: 'danger' } : c));
    }
    this.closeReversarModal();
  }
}
