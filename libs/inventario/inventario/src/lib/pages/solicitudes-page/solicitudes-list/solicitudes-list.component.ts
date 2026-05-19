import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { SolicitudGil, EstadoGil } from '../../../models/solicitudes-gil.model';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

@Component({
  selector: 'restaurant-solicitudes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, KpiCardComponent],
  templateUrl: './solicitudes-list.component.html',
  styleUrl: './solicitudes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesListComponent implements OnInit {

  private facade = inject(SolicitudesFacade);

  solicitudes = this.facade.solicitudes;
  loading = this.facade.loading;

  ngOnInit(): void {
    this.facade.loadAll();
  }

  // ─── KPIs calculados (4 tarjetas del prototipo) ────────────────────────────
  totalSolicitudes   = computed(() => this.solicitudes().length);
  totalBorradores    = computed(() => this.solicitudes().filter(s => s.estado === 'Borrador').length);
  enTramite          = computed(() => this.solicitudes().filter(s => s.estado === 'Pendiente' || s.estado === 'Validado').length);
  finalizadas        = computed(() => this.solicitudes().filter(s => s.estado === 'Aprobado' || s.estado === 'Procesado').length);

  // ─── Opciones filtros ──────────────────────────────────────────────────────
  estadoOptions = [
    { value: '', label: 'Filtrar por Estado' },
    { value: 'Borrador',  label: 'Borrador'  },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Validado',  label: 'Validado'  },
    { value: 'Aprobado',  label: 'Aprobado'  },
    { value: 'Procesado', label: 'Procesado' },
  ];

  fechaOptions = [
    { value: '', label: 'Filtrar por Fecha' },
    { value: '7d',    label: 'Últimos 7 días' },
    { value: 'mes',   label: 'Este mes'       },
    { value: '2024',  label: 'Año 2024'       },
  ];

  // ─── Helpers ───────────────────────────────────────────────────────────────
  getInitials(nombre: string): string {
    return nombre
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  formatCOP(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /** Editar solo está habilitado en Borrador o Pendiente */
  canEdit(estado: string): boolean {
    return estado === 'Borrador' || estado === 'Pendiente';
  }

  onSearch(term: string): void    { this.facade.setFiltros({ busqueda: term });    }
  onFilterEstado(v: any): void { this.facade.setFiltros({ estado: v ? (v as EstadoGil) : undefined });       }
  onFilterFecha(v: string): void  { this.facade.setFiltros({ fechaRango: v });        }
  onExportPdf(id: string | number): void { console.log('PDF:', id);  }

  // ── Modal State ──────────────────────────────────────────────────────────
  showDeleteModal = signal<boolean>(false);
  itemToDelete = signal<any>(null);
  deleteBlocked = signal<boolean>(false);

  // ── Actions ──────────────────────────────────────────────────────────────
  onDelete(item: any): void {
    this.itemToDelete.set(item);
    // Simulating block logic: Only 'Borrador' can be deleted
    if (item.estado !== 'Borrador') {
      this.deleteBlocked.set(true);
    } else {
      this.deleteBlocked.set(false);
    }
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.itemToDelete.set(null);
  }

  confirmDelete(): void {
    const id = this.itemToDelete()?.codigo;
    if (id) {
      this.facade.eliminarSolicitud(id);
    }
    this.closeDeleteModal();
  }
}
