import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  KpiCardComponent,
  DataTableComponent,
  LucideIconComponent,
  ButtonComponent,
  StatusBadgeComponent,
  InputComponent,
} from '@restaurant/shared/ui';
import { AfectacionPresupuestal } from '../../../models/presupuesto.model';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';
import { GilesService } from '../../../data-access/services/giles.service';
import { FacturasService } from '../../../data-access/services/facturas.service';
import { GilResponse } from '../../../data-access/api/procurement.api';
import { OnInit, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { FormatoMonedaPipe } from '../../../pipes/formato-moneda.pipe';
import { ExportarComponent } from '../../../components/exportar/exportar.component';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-presupuesto-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    KpiCardComponent,
    DataTableComponent,
    LucideIconComponent,
    ButtonComponent,
    StatusBadgeComponent,
    InputComponent,
    FormatoMonedaPipe,
    ExportarComponent,
  ],
  templateUrl: './presupuesto-dashboard.component.html',
  styleUrl: './presupuesto-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoDashboardComponent implements OnInit {
  public facade = inject(PresupuestoFacade);
  protected readonly i18n = inject(I18nService);
  private gilesService = inject(GilesService);
  private facturasService = inject(FacturasService);

  /** GILs cargados para mostrar el número (no el UUID) en la tabla de afectaciones. */
  private giles = signal<GilResponse[]>([]);

  /** Resuelve un rubroId (UUID) a su código legible. */
  rubroLabel(rubroId: string): string {
    return this.facade.rubros().find(r => r.id === rubroId)?.codigo ?? rubroId;
  }

  /** Resuelve un gilId (UUID) a su número de GIL legible. */
  gilLabel(gilId: string | undefined): string {
    if (!gilId) return '—';
    return this.giles().find(g => g.id === gilId)?.numeroGil ?? gilId;
  }

  // ── Modal de exportación ──────────────────────────────────────────────────
  showExportModal = signal(false);

  /** Resumen global del backend — null hasta que cargue */
  resumen      = this.facade.resumen;
  resumenGlobal = this.facade.resumenGlobal;

  /** Grupos de rubros agrupados por ficha (tabla colapsable) — Sección A del Excel */
  grupos = this.facade.grupos;

  /** Grupos de rubros por posición presupuestal + fuente (SIIF) — Sección B del Excel */
  gruposPorPosicion = this.facade.gruposPorPosicion;

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
  /** Texto del buscador de la tabla (concepto, GIL, rubro o estado). */
  filtroBusqueda = signal<string>('');
  filtrosActivos = computed(() => (this.filtroEstado() ? 1 : 0));

  /** Estados de afectación presentes en los datos (para el select) */
  estadosDisponibles = computed(() => Array.from(new Set(this.afectaciones().map(a => a.estado))));

  /** Afectaciones tras aplicar el filtro de estado y el texto del buscador */
  afectacionesFiltradas = computed(() => {
    const e = this.filtroEstado();
    const q = this.filtroBusqueda().trim().toLowerCase();
    return this.afectaciones().filter(a => {
      if (e && a.estado !== e) return false;
      if (!q) return true;
      const campos = [
        a.concepto,
        this.gilLabel(a.gilId),
        this.rubroLabel(a.rubroId),
        a.estado,
      ];
      return campos.some(c => c?.toLowerCase().includes(q));
    });
  });

  onToggleFilters(): void { this.showFilters.update(v => !v); }
  onFilterEstado(v: string): void { this.filtroEstado.set(v); this.paginaActual.set(1); }
  onSearch(v: string): void { this.filtroBusqueda.set(v); this.paginaActual.set(1); }
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
    // Para mostrar el número de GIL (no el UUID) en la tabla de afectaciones.
    // Un compromiso puede referenciar un GIL en cualquier estado (COMPROMETIDO,
    // CERRADO e incluso APLICADO/legalizado), así que se cargan TODOS los GILs sin
    // filtrar por estado: cualquier filtro deja afectaciones mostrando el UUID crudo.
    // size=100 es el máximo que admite el backend (101+ → 400 Bad Request).
    this.gilesService.getGiles({ size: 100 }).subscribe(page =>
      this.giles.set(page.content ?? []),
    );
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

  // ── Modal de Registrar Pago ─────────────────────────────────────────────────
  showPagoModal   = signal(false);
  pagoCompromisoId = signal('');
  pagoConcepto    = signal('');
  pagoCufe        = signal('');
  pagoMonto       = signal('');
  pagoFecha       = signal(new Date().toISOString().split('T')[0]);
  /** True mientras se resuelve el CUFE del FEL conciliado al abrir el pago. */
  pagoCargandoCufe = signal(false);

  /** Sólo se puede pagar un compromiso PENDIENTE. */
  esPagable(estado: string): boolean {
    return estado === 'PENDIENTE';
  }

  /** Sólo se puede anular un compromiso aún no APLICADO (en la práctica, PENDIENTE). */
  esAnulable(estado: string): boolean {
    return estado === 'PENDIENTE';
  }

  /** Anula el compromiso de la afectación y refresca el dashboard. */
  onAnular(a: AfectacionPresupuestal): void {
    if (!this.esAnulable(a.estado)) return;
    this.facade.anularCompromiso(a.id);
  }

  abrirPago(a: AfectacionPresupuestal): void {
    this.pagoCompromisoId.set(a.id);
    this.pagoConcepto.set(a.concepto);
    this.pagoMonto.set(String(a.monto));
    this.pagoCufe.set('');
    this.pagoFecha.set(new Date().toISOString().split('T')[0]);
    this.showPagoModal.set(true);

    // El compromiso ya tiene un GIL conciliado con un FEL: el CUFE existe, no hay
    // por qué pedírselo al usuario. Se resuelve conciliación → factura → CUFE.
    if (!a.gilId) return;
    this.pagoCargandoCufe.set(true);
    this.facturasService.getConciliacionGil({ gilId: a.gilId })
      .pipe(
        switchMap(conciliacion => this.facturasService.getFacturaById(conciliacion.facturaId)),
      )
      .subscribe({
        next: factura => {
          if (factura) this.pagoCufe.set(factura.cufe);
          this.pagoCargandoCufe.set(false);
        },
        error: () => this.pagoCargandoCufe.set(false),
      });
  }

  cerrarPago(): void {
    this.showPagoModal.set(false);
  }

  pagoValido = computed(() => this.pagoCufe().trim().length > 0 && Number(this.pagoMonto()) > 0);

  confirmarPago(): void {
    if (!this.pagoValido()) return;
    this.facade.registrarPago(this.pagoCompromisoId(), {
      cufeFuenteId: this.pagoCufe().trim(),
      monto:        Number(this.pagoMonto()),
      fecha:        this.pagoFecha(),
    });
    this.showPagoModal.set(false);
  }

  openExportModal(): void {
    this.showExportModal.set(true);
  }

  closeExportModal(): void {
    this.showExportModal.set(false);
  }

  onExport(formato: string): void {
    // Reporte de Presupuesto General / Ejecución (lo genera ga-ms-reportes).
    this.facade.exportar(formato);
    this.closeExportModal();
  }
}
