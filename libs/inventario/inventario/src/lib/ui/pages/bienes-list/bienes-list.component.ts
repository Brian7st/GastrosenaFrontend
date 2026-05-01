import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  PageHeaderComponent, 
  SearchFilterComponent, 
  SelectFilterComponent,
  LoadingSkeletonComponent,
  KeywordConfirmModalComponent
} from '@restaurant/shared/ui';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { BienExportService } from '../../../data-access/services/bien-export.service';
import { BienKpiCardsComponent } from '../../components/bien-kpi-cards/bien-kpi-cards.component';
import { BienTableComponent } from '../../components/bien-table/bien-table.component';
import { BienFormComponent } from '../../modals/bien-form/bien-form.component';
import { BienImportModalComponent } from '../../modals/bien-import/bien-import.component';
import { Bien, BienFormDto } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bienes-list',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchFilterComponent,
    SelectFilterComponent,
    LoadingSkeletonComponent,
    BienKpiCardsComponent,
    BienTableComponent,
    BienFormComponent,
    BienImportModalComponent,
    KeywordConfirmModalComponent
  ],
  templateUrl: './bienes-list.component.html',
  styleUrl: './bienes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienesListPageComponent implements OnInit {
  private facade = inject(InventarioFacade);
  private router = inject(Router);
  private exportService = inject(BienExportService);

  // Seleccionamos los estados desde el facade (Signals)
  bienes = this.facade.bienes;
  kpis = this.facade.kpis;
  loading = this.facade.loading;
  filtros = this.facade.filtros;

  // Control de Modales
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
    this.facade.loadAll(); // Refrescar
  }

  onExportBienes(): void {
    this.exportService.exportToCsv(this.bienes());
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
    // Aquí iría la lógica de persistencia vía Facade
    console.log('Guardando bien:', dto);
    this.showFormModal.set(false);
  }

  onVerDetalle(bien: Bien): void {
    this.router.navigate(['/inventario/bienes', bien.id]);
  }

  onEliminar(bien: Bien): void {
    if (bien.stockActual > 0) {
      alert('No se puede eliminar un bien con stock activo. Realice una salida primero.');
      return;
    }
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
