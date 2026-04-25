import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { ConsolidadoDetalle, MOCK_CONSOLIDADO_DETALLE } from '../models/consolidado.model';
import { ExportModalComponent } from '../components/export-modal/export-modal.component';
import { ReverseModalComponent } from '../components/reverse-modal/reverse-modal.component';

@Component({
    selector: 'app-conciliacion-detail',
    imports: [CommonModule, RouterModule, LucideIconComponent,],
    templateUrl: './conciliacion-detail.component.html',
    styleUrls: ['./conciliacion-detail.component.scss']
})
export class ConciliacionDetailComponent {
  detalle = signal<ConsolidadoDetalle>(MOCK_CONSOLIDADO_DETALLE);

  showExportModal = signal(false);
  showReverseModal = signal(false);

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }

  openExportModal() {
    this.showExportModal.set(true);
  }

  closeExportModal() {
    this.showExportModal.set(false);
  }

  openReverseModal() {
    this.showReverseModal.set(true);
  }

  closeReverseModal() {
    this.showReverseModal.set(false);
  }
}
