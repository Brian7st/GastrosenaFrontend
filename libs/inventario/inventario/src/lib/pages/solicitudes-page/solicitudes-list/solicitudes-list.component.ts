import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent, KeywordConfirmModalComponent } from '@restaurant/shared/ui';
import { SolicitudGil, EstadoGil } from '../../../models/solicitudes-gil.model';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-solicitudes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, KpiCardComponent, KeywordConfirmModalComponent, EmptyStateComponent],
  templateUrl: './solicitudes-list.component.html',
  styleUrl: './solicitudes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesListComponent implements OnInit {

  private facade = inject(SolicitudesFacade);
  private router  = inject(Router);
  protected readonly i18n = inject(I18nService);

  solicitudes = this.facade.solicitudes;
  loading     = this.facade.loading;
  paginacion  = this.facade.paginacion;

  paginas = computed(() =>
    Array.from({ length: this.paginacion().totalPages }, (_, i) => i)
  );

  // ─── Filtros (panel colapsable) ──────────────────────────────────────────────
  showFilters  = signal(false);
  filtroEstado = signal<string>('');
  filtrosActivos = computed(() => (this.filtroEstado() ? 1 : 0));

  onToggleFilters(): void { this.showFilters.update(v => !v); }
  onLimpiarFiltros(): void {
    this.filtroEstado.set('');
    this.facade.cargarSolicitudes({ estado: undefined });
  }

  ngOnInit(): void {
    this.facade.loadAll();
  }

  // ─── KPIs calculados ─────────────────────────────────────────────────────
  totalSolicitudes = computed(() => this.paginacion().totalElements);
  // Page-scoped — counts only current page, not total (backend does not expose per-estado aggregates)
  borradorPagina   = computed(() => this.solicitudes().filter(s => s.estado === 'BORRADOR').length);
  // Page-scoped — counts only current page, not total
  enTramitePagina  = computed(() => this.solicitudes().filter(s => s.estado === 'EMITIDO' || s.estado === 'ENVIADO_PROVEEDOR' || s.estado === 'VERIFICADO').length);
  // Page-scoped — counts only current page, not total
  finalizadasPagina = computed(() => this.solicitudes().filter(s => s.estado === 'CERRADO').length);

  // ─── Opciones filtros ──────────────────────────────────────────────────────
  estadoOptions = computed(() => [
    { value: '',                  label: this.i18n.t('solicitudes-list.filter_placeholder') },
    { value: 'BORRADOR',          label: this.i18n.t('solicitudes-list.estado_borrador') },
    { value: 'EMITIDO',           label: this.i18n.t('solicitudes-list.estado_emitido') },
    { value: 'ENVIADO_PROVEEDOR', label: this.i18n.t('solicitudes-list.estado_enviado_proveedor') },
    { value: 'VERIFICADO',        label: this.i18n.t('solicitudes-list.estado_verificado') },
    { value: 'CERRADO',           label: this.i18n.t('solicitudes-list.estado_cerrado') },
  ]);

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

  canEdit(estado: string): boolean {
    return estado === 'BORRADOR';
  }

  onSearch(term: string): void        { this.facade.cargarSolicitudes({ busqueda: term }); }
  onFilterEstado(v: string): void     {
    this.filtroEstado.set(v);
    this.facade.cargarSolicitudes({ estado: v ? (v as EstadoGil) : undefined });
  }
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
    const id = this.itemToDelete()?.id;
    if (id) {
      this.facade.eliminarSolicitud(String(id));
    }
    this.closeDeleteModal();
  }
}
