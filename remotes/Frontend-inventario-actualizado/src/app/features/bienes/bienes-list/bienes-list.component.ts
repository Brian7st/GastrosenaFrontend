import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { Bien, BIENES_MOCK } from '../models/bien.model';
import { BienFormModalComponent } from '../components/bien-form-modal.component';
import { DeleteConfirmModalComponent } from '../components/delete-confirm-modal.component';

@Component({
    selector: 'app-bienes-list',
    imports: [CommonModule, RouterModule, FormsModule, LucideIconComponent, BienFormModalComponent, DeleteConfirmModalComponent],
    templateUrl: './bienes-list.component.html',
    styleUrls: ['./bienes-list.component.scss']
})
export class BienesListComponent {
  bienes = signal<Bien[]>(BIENES_MOCK);
  searchTerm = '';
  currentPage = signal(1);
  totalBienes = signal(1248);
  itemsPerPage = 30;

  showNuevoModal = signal(false);
  showDeleteModal = signal(false);
  bienToDelete = signal<Bien | null>(null);

  // Stats
  valorTotal = signal('$458.240.000');
  bienesAlerta = signal(23);
  movimientosHoy = signal(156);

  get totalPages(): number {
    return Math.ceil(this.totalBienes() / this.itemsPerPage);
  }

  get filteredBienes(): Bien[] {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.bienes();
    return this.bienes().filter(b =>
      b.nombre.toLowerCase().includes(term) ||
      b.codigoSena.toLowerCase().includes(term) ||
      b.codigoProveedor.toLowerCase().includes(term)
    );
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }

  openNuevoModal(): void {
    this.showNuevoModal.set(true);
  }

  closeNuevoModal(): void {
    this.showNuevoModal.set(false);
  }

  openDeleteModal(bien: Bien): void {
    this.bienToDelete.set(bien);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.bienToDelete.set(null);
  }

  onDeleteConfirmed(): void {
    // Aquí iría la lógica de backend
    this.closeDeleteModal();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }
}
