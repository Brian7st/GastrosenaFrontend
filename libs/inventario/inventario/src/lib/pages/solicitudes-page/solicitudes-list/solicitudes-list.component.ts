import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent, KeywordConfirmModalComponent } from '@restaurant/shared/ui';
import { SolicitudGil, EstadoGil } from '../../../models/solicitudes-gil.model';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

@Component({
  selector: 'restaurant-solicitudes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, KpiCardComponent, KeywordConfirmModalComponent],
  templateUrl: './solicitudes-list.component.html',
  styleUrl: './solicitudes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesListComponent implements OnInit {

  private facade = inject(SolicitudesFacade);
  private router  = inject(Router);

  solicitudes = this.facade.solicitudes;
  loading     = this.facade.loading;
  paginacion  = this.facade.paginacion;

  paginas = computed(() =>
    Array.from({ length: this.paginacion().totalPages }, (_, i) => i)
  );

  ngOnInit(): void {
    this.facade.loadAll();
  }

  // ─── KPIs calculados ─────────────────────────────────────────────────────
  totalSolicitudes   = computed(() => this.paginacion().totalElements);
  totalBorradores    = computed(() => this.solicitudes().filter(s => s.estado === 'BORRADOR').length);
  enTramite          = computed(() => this.solicitudes().filter(s => s.estado === 'EMITIDO' || s.estado === 'ENVIADO_PROVEEDOR').length);
  finalizadas        = computed(() => this.solicitudes().filter(s => s.estado === 'CERRADO').length);

  // ─── Opciones filtros ──────────────────────────────────────────────────────
  estadoOptions = [
    { value: '',                  label: 'Filtrar por Estado'  },
    { value: 'BORRADOR',          label: 'Borrador'            },
    { value: 'EMITIDO',           label: 'Emitido'             },
    { value: 'ENVIADO_PROVEEDOR', label: 'Enviado a Proveedor' },
    { value: 'CERRADO',           label: 'Cerrado'             },
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

  getAvatarColor(id: string | number): string {
    const colors = ['blue', 'purple', 'amber', 'green', 'slate'];
    return colors[Number(id) % colors.length];
  }

  getMontoTotal(s: SolicitudGil): number {
    return s.bienes?.reduce((acc, b) => acc + b.subtotal, 0) ?? 0;
  }

  formatCOP(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /** Editar solo está habilitado en Borrador o Emitido */
  canEdit(estado: string): boolean {
    return estado === 'BORRADOR' || estado === 'EMITIDO';
  }

  onSearch(term: string): void        { this.facade.cargarSolicitudes({ busqueda: term }); }
  onFilterEstado(v: string): void     { this.facade.cargarSolicitudes({ estado: v ? (v as EstadoGil) : undefined }); }
  onFilterFecha(v: string): void      { this.facade.cargarSolicitudes({ fechaRango: v }); }
  onIrAPagina(page: number): void     { this.facade.irAPagina(page); }
  onExportPdf(id: string | number): void {
    this.router.navigate(['/app/inventario/solicitudes-gil', id, 'exportar']);
  }
  onView(id: string | number): void {
    this.router.navigate(['/app/inventario/solicitudes-gil', id]);
  }
  onEdit(id: string | number): void {
    this.router.navigate(['/app/inventario/solicitudes-gil', id, 'editar']);
  }

  // ── Modal State ──────────────────────────────────────────────────────────
  showDeleteModal = signal<boolean>(false);
  itemToDelete = signal<SolicitudGil | null>(null);
  deleteBlocked = signal<boolean>(false);

  // ── Actions ──────────────────────────────────────────────────────────────
  onDelete(item: SolicitudGil): void {
    this.itemToDelete.set(item);
    // Simulating block logic: Only 'BORRADOR' can be deleted
    if (item.estado !== 'BORRADOR') {
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
    const id = this.itemToDelete()?.numeroGil;
    if (id) {
      this.facade.eliminarSolicitud(id);
    }
    this.closeDeleteModal();
  }
}
