import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent, LoadingSkeletonComponent } from '@restaurant/shared/ui';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { BienFormComponent } from '../../modals/bien-form/bien-form.component';
import { BienImportModalComponent } from '../../modals/bien-import/bien-import.component';
import { BienDeleteModalComponent } from '../../modals/bien-delete-modal/bien-delete-modal.component';
import { Bien, BienFormDto } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bienes-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    LoadingSkeletonComponent,
    BienFormComponent,
    BienImportModalComponent,
    BienDeleteModalComponent,
  ],
  templateUrl: './bienes-list.component.html',
  styleUrl: './bienes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienesListPageComponent implements OnInit {
  private facade = inject(InventarioFacade);
  private router = inject(Router);

  // State signals
  bienes = this.facade.bienes;
  kpis = this.facade.kpis;
  loading = this.facade.loading;

  // Modal controls
  showFormModal = signal(false);
  showDeleteModal = signal(false);
  showImportModal = signal(false);
  formMode = signal<'create' | 'edit'>('create');
  selectedBien = signal<Bien | undefined>(undefined);

  ngOnInit(): void {
    this.facade.loadAll();
  }

  onSearch(query: string): void {
    this.facade.setFiltros({ busqueda: query });
  }

  onImportBienes(): void {
    this.showImportModal.set(true);
  }

  onProcessImport(data: any[]): void {
    console.log('Procesando importación de', data.length, 'registros');
    this.showImportModal.set(false);
    this.facade.loadAll();
  }

  onExportBienes(): void {
    this.router.navigate(['/app/inventario/bienes/exportar']);
  }

  onNuevoBien(): void {
    this.selectedBien.set(undefined);
    this.formMode.set('create');
    this.showFormModal.set(true);
  }

  onEditar(bien: Bien): void {
    this.selectedBien.set(bien);
    this.formMode.set('edit');
    this.showFormModal.set(true);
  }

  onSaveBien(dto: BienFormDto): void {
    console.log('Guardando bien:', dto);
    this.showFormModal.set(false);
  }

  onVerDetalle(bien: Bien): void {
    this.router.navigate(['/app/inventario/bienes', bien.id]);
  }

  onEliminar(bien: Bien): void {
    this.selectedBien.set(bien);
    this.showDeleteModal.set(true);
  }

  confirmarEliminacion(): void {
    if (this.selectedBien()) {
      this.facade.eliminarBien(this.selectedBien()!.id);
      this.showDeleteModal.set(false);
    }
  }
}
