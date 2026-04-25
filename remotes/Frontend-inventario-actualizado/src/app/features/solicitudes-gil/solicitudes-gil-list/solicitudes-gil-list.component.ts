import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { SolicitudGil, SOLICITUDES_GIL_MOCK } from '../models/solicitud-gil.model';
import { SolicitudDeleteModalComponent } from '../components/solicitud-delete-modal/solicitud-delete-modal.component';

@Component({
    selector: 'app-solicitudes-gil-list',
    imports: [CommonModule, FormsModule, RouterModule, LucideIconComponent, SolicitudDeleteModalComponent],
    templateUrl: './solicitudes-gil-list.component.html',
    styleUrls: ['./solicitudes-gil-list.component.scss']
})
export class SolicitudesGilListComponent {
  solicitudes = signal<SolicitudGil[]>(SOLICITUDES_GIL_MOCK);
  showDeleteModal = signal(false);
  solicitudToDelete = signal<SolicitudGil | null>(null);

  currentPage = signal(1);

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }

  openDeleteModal(solicitud: SolicitudGil) {
    this.solicitudToDelete.set(solicitud);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.solicitudToDelete.set(null);
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }
}
