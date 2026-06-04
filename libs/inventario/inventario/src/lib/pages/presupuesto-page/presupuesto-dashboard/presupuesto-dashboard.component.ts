import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  KpiCardComponent,
  DataTableComponent,
  LucideIconComponent,
  ButtonComponent,
  StatusBadgeComponent,
} from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';
import { OnInit, inject } from '@angular/core';
import { FormatoMonedaPipe } from '../../../pipes/formato-moneda.pipe';
import { ExportarComponent } from '../../../components/exportar/exportar.component';

@Component({
  selector: 'restaurant-presupuesto-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    KpiCardComponent,
    DataTableComponent,
    LucideIconComponent,
    ButtonComponent,
    StatusBadgeComponent,
    FormatoMonedaPipe,
    ExportarComponent,
  ],
  templateUrl: './presupuesto-dashboard.component.html',
  styleUrl: './presupuesto-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoDashboardComponent implements OnInit {
  public facade = inject(PresupuestoFacade);

  // ── Modal de exportación ──────────────────────────────────────────────────
  showExportModal = signal(false);

  /** Resumen global del backend — null hasta que cargue */
  resumen      = this.facade.resumen;
  resumenGlobal = this.facade.resumenGlobal;

  /** Grupos de rubros agrupados por ficha (tabla colapsable) */
  grupos = this.facade.grupos;

  /** Estado de expansión por fichaId */
  expandidos = signal<Record<string, boolean>>({
    'PRG-001': true,
    'PRG-002': false,
    'PRG-003': false,
  });

  /** Historial de afectaciones — fuente completa */
  afectaciones = this.facade.afectaciones;

  // ── Filtros (panel colapsable) ──────────────────────────────────────────────
  showFilters  = signal(false);
  filtroEstado = signal<string>('');
  filtrosActivos = computed(() => (this.filtroEstado() ? 1 : 0));

  /** Estados de afectación presentes en los datos (para el select) */
  estadosDisponibles = computed(() => Array.from(new Set(this.afectaciones().map(a => a.estado))));

  /** Afectaciones tras aplicar el filtro de estado */
  afectacionesFiltradas = computed(() => {
    const e = this.filtroEstado();
    return e ? this.afectaciones().filter(a => a.estado === e) : this.afectaciones();
  });

  onToggleFilters(): void { this.showFilters.update(v => !v); }
  onFilterEstado(v: string): void { this.filtroEstado.set(v); this.paginaActual.set(1); }
  onLimpiarFiltros(): void { this.filtroEstado.set(''); this.paginaActual.set(1); }

  // ── Paginación ─────────────────────────────────────────────────────────────
  readonly ITEMS_POR_PAGINA = 5;
  paginaActual = signal(1);

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.afectacionesFiltradas().length / this.ITEMS_POR_PAGINA))
  );

  afectacionesPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.ITEMS_POR_PAGINA;
    return this.afectacionesFiltradas().slice(inicio, inicio + this.ITEMS_POR_PAGINA);
  });

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  irAPagina(n: number): void {
    if (n >= 1 && n <= this.totalPaginas()) {
      this.paginaActual.set(n);
    }
  }

  anterior(): void { this.irAPagina(this.paginaActual() - 1); }
  siguiente(): void { this.irAPagina(this.paginaActual() + 1); }

  /** Template helper: evita pipe externo */
  minOf(a: number, b: number): number { return Math.min(a, b); }

  /** Próximos vencimientos */
  vencimientos = this.facade.vencimientos;

  /** Ejecución mensual para gráfico de barras */
  ejecucionMensual = this.facade.ejecucionMensual;

  ngOnInit(): void {
    this.facade.loadAll();
  }

  /** Toggle de grupo colapsable */
  toggleGrupo(fichaId: string): void {
    this.expandidos.update(prev => ({
      ...prev,
      [fichaId]: !prev[fichaId],
    }));
  }

  /** Helper: verificar si grupo está expandido */
  isExpanded(fichaId: string): boolean {
    return this.expandidos()[fichaId] ?? false;
  }

  /** Helper: clase CSS del badge de ejecución */
  getEjecucionClass(porcentaje: number): string {
    if (porcentaje >= 90) return 'ejecucion-danger';
    if (porcentaje >= 70) return 'ejecucion-warning';
    return 'ejecucion-success';
  }

  /** Helper: configuración unificada para badges de tipo de afectación */
  getTipoConfig(tipo: string): { status: 'info'|'success'|'warning'|'danger'; cssClass: string } {
    switch (tipo.toLowerCase()) {
      case 'pago':
        return { status: 'success', cssClass: 'tipo-badge--pago' };
      case 'traslado':
        return { status: 'warning', cssClass: 'tipo-badge--traslado' };
      case 'anulación':
      case 'anulacion':
        return { status: 'danger', cssClass: 'tipo-badge--anulacion' };
      case 'compromiso':
      default:
        return { status: 'info', cssClass: 'tipo-badge--compromiso' };
    }
  }

  /** Helper: clase CSS para urgencia de vencimiento */
  getUrgenciaClass(urgencia: string): string {
    switch (urgencia) {
      case 'critico': return 'vencimiento-card--critico';
      case 'proximo': return 'vencimiento-card--proximo';
      default:        return 'vencimiento-card--normal';
    }
  }

  openExportModal(): void {
    this.showExportModal.set(true);
  }

  closeExportModal(): void {
    this.showExportModal.set(false);
  }

  onExport(formato: string): void {
    console.log('Exportar presupuesto:', formato);
    this.closeExportModal();
  }
}
