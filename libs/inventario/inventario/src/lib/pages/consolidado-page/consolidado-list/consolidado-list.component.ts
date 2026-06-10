import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { ExportarConsolidadoModalComponent } from '../components/exportar-consolidado-modal/exportar-consolidado-modal.component';
import { ReversarConsolidadoModalComponent } from '../components/reversar-consolidado-modal/reversar-consolidado-modal.component';
import { Consolidado } from '../../../models/consolidado.model';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';
import { ConsolidadoFacade } from '../../../data-access/consolidado.facade';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';

@Component({
  selector: 'restaurant-consolidado-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, KpiCardComponent, StatusBadgeComponent, ExportarConsolidadoModalComponent, ReversarConsolidadoModalComponent, EmptyStateComponent],
  templateUrl: './consolidado-list.component.html',
  styleUrl: './consolidado-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidadoListComponent implements OnInit {
  private router = inject(Router);
  private facade = inject(ConsolidadoFacade);
  private presupuestoFacade = inject(PresupuestoFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  consolidados = this.facade.consolidados;
  loading      = this.facade.loading;
  searchText   = signal<string>('');

  // ── Ejecución presupuestal real (GET /budget/presupuestos/resumen) ───────
  resumenPresupuestal = this.presupuestoFacade.resumenGlobal;
  /** % de ejecución (comprometido + pagado sobre asignado). null mientras carga. */
  porcentajeEjecucion = computed(() => this.resumenPresupuestal()?.porcentajeEjecucion ?? null);

  showExportModal      = signal(false);
  showReversarModal    = signal(false);
  selectedReversarItem = signal<Consolidado | null>(null);
  isReversarBlocked    = signal(false);

  // ── Filtros (panel colapsable) ──────────────────────────────────────────────
  showFilters  = signal(false);
  filtroEstado = signal<string>('');
  filtrosActivos = computed(() => (this.filtroEstado() ? 1 : 0));

  onToggleFilters(): void { this.showFilters.update(v => !v); }
  onFilterEstado(v: string): void { this.filtroEstado.set(v); this.paginaActual.set(1); }
  onLimpiarFiltros(): void { this.filtroEstado.set(''); this.paginaActual.set(1); }

  // ── Filtro cliente ────────────────────────────────────────────────────────
  filteredConsolidados = computed(() => {
    const q = this.searchText().toLowerCase();
    const estado = this.filtroEstado();
    return this.consolidados().filter(c => {
      const matchQ = !q ||
        String(c.id).toLowerCase().includes(q) ||
        c.fechaGeneracion.toLowerCase().includes(q) ||
        c.estado.toLowerCase().includes(q);
      const matchEstado = !estado || c.estado === estado;
      return matchQ && matchEstado;
    });
  });

  // ── Paginación cliente ──────────────────────────────────────────────────────
  readonly ITEMS_POR_PAGINA = 8;
  paginaActual = signal(1);

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.filteredConsolidados().length / this.ITEMS_POR_PAGINA))
  );

  consolidadosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.ITEMS_POR_PAGINA;
    return this.filteredConsolidados().slice(inicio, inicio + this.ITEMS_POR_PAGINA);
  });

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  irAPagina(n: number): void {
    if (n >= 1 && n <= this.totalPaginas()) { this.paginaActual.set(n); }
  }
  anterior(): void { this.irAPagina(this.paginaActual() - 1); }
  siguiente(): void { this.irAPagina(this.paginaActual() + 1); }

  // ── KPIs derivados de la lista real ─────────────────────────────────────
  kpiTotalEjecutado = computed(() =>
    this.consolidados().reduce((acc, c) => acc + c.totales.valorNeto, 0)
  );
  kpiContabilizados = computed(() => 0);
  kpiGenerados      = computed(() => this.consolidados().filter(c => c.estado === 'GENERADO').length);
  kpiReversados     = computed(() => this.consolidados().filter(c => c.estado === 'REVERSADO').length);

  ngOnInit(): void {
    this.facade.loadAll();
    this.presupuestoFacade.cargarResumenGlobal();
  }

  verPresupuesto(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }

  onSearch(query: string): void {
    this.searchText.set(query);
    this.paginaActual.set(1);
  }

  openExportModal(): void {
    this.showExportModal.set(true);
  }

  closeExportModal(): void {
    this.showExportModal.set(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onExport(_format: 'excel' | 'pdf'): void {
    // Exportación real pendiente de integración HTTP
    this.showExportModal.set(false);
  }

  goToDetail(id: string): void {
    this.router.navigate(['/app/inventario/consolidado', id]);
  }

  reversar(id: string): void {
    const item = this.consolidados().find(c => c.id === id);
    if (item) {
      this.selectedReversarItem.set(item);
      this.isReversarBlocked.set(item.estado === 'REVERSADO');
      this.showReversarModal.set(true);
    }
  }

  getVariantFromEstado(estado: string): 'info' | 'success' | 'danger' | 'warning' {
    return estado === 'REVERSADO' ? 'danger' : 'info';
  }

  closeReversarModal(): void {
    this.showReversarModal.set(false);
    this.selectedReversarItem.set(null);
  }

  confirmReversar(): void {
    const item = this.selectedReversarItem();
    if (item) this.facade.reversarConsolidado(item.numero);
    this.closeReversarModal();
  }
}
