import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent, KpiCardComponent, LoadingSkeletonComponent } from '@restaurant/shared/ui';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { BienFormComponent } from '../../../ui/modals/bien-form/bien-form.component';
import { BienImportModalComponent, BienImportPayload } from '../../modals/bien-import/bien-import.component';
import { BienDeleteModalComponent } from '../../modals/bien-delete-modal/bien-delete-modal.component';
import { Bien, BienFormDto, EstadoBien } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bienes-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    KpiCardComponent,
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
  bienes      = this.facade.bienes;
  kpis        = this.facade.kpis;
  loading     = this.facade.loading;
  paginacion  = this.facade.paginacion;

  paginas = computed(() =>
    Array.from({ length: this.paginacion().totalPages }, (_, i) => i)
  );

  showFilters = signal(false);

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
    this.facade.cargarBienes({ busqueda: query });
  }

  onIrAPagina(page: number): void {
    this.facade.irAPagina(page);
  }

  onImportBienes(): void {
    this.showImportModal.set(true);
  }

  onProcessImport(payload: BienImportPayload): void {
    if (payload.tipo === 'excel') {
      this.facade.importarBienesExcel(payload.archivo);
      this.showImportModal.set(false);
      return;
    }

    this.facade.importarBienes(payload.filas.map(row => ({
      codigoSena: row.codigoSena,
      descripcion: row.descripcion,
      categoria: row.categoria ?? 'General',
      unidadMedida: row.unidadMedida,
      codigoProveedor: row.codigoProveedor,
      stockMinimo: row.stockMinimo ?? null,
    })));
    this.showImportModal.set(false);
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
    if (this.formMode() === 'create') {
      this.facade.crearBien(dto);
    } else {
      this.facade.actualizarBien(this.selectedBien()!.id, dto);
    }
    this.showFormModal.set(false);
  }

  onVerDetalle(bien: Bien): void {
    this.router.navigate(['/app/inventario/bienes', bien.id]);
  }

  onDesactivar(bien: Bien): void {
    this.facade.desactivarBien(bien.id);
  }

  onActivar(bien: Bien): void {
    this.facade.activarBien(bien.id);
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

  getEstadoBadgeClass(estado: EstadoBien): string {
    const map: Record<EstadoBien, string> = {
      'Activo': 'estado-badge--activo',
      'Bajo Stock': 'estado-badge--bajo',
      'Agotado': 'estado-badge--agotado',
      'Inactivo': 'estado-badge--inactivo'
    };
    return map[estado] || '';
  }
}
