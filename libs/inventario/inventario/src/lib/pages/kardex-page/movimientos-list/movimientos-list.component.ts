import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KpiCardComponent, DataTableComponent, LucideIconComponent, ButtonComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';
import { MovimientosService } from '../../../data-access/services/movimientos.service';
import { Movimiento } from '../../../models/movimiento.model';
import { I18nService } from '../../../i18n/i18n.service';

type Vista = 'documentos' | 'todos';
type TipoMovimiento = Movimiento['tipo'];

@Component({
  selector: 'restaurant-movimientos-list',
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
    EmptyStateComponent,
  ],
  templateUrl: './movimientos-list.component.html',
  styleUrl: './movimientos-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientosListComponent implements OnInit {
  private facade             = inject(KardexFacade);
  protected readonly i18n = inject(I18nService);
  private movimientosService = inject(MovimientosService);

  // ── Vista activa (toggle) ─────────────────────────────────────────────────
  vista = signal<Vista>('documentos');

  // ── Estado reactivo desde facade (vista documentos) ───────────────────────
  documentos = this.facade.documentos;
  loading    = this.facade.loading;
  error      = this.facade.error;
  paginacion = this.facade.paginacion;
  searchText = signal<string>('');

  // ── Estado para vista "todos los movimientos" ─────────────────────────────
  movimientosTodos     = signal<Movimiento[]>([]);
  loadingTodos         = signal(false);
  errorTodos           = signal<string | null>(null);
  /** true una vez que se cargaron los datos (lazy) */
  private todosLoaded  = signal(false);

  // Paginación de la vista "todos los movimientos"
  private readonly tamanoTodos = 20;
  paginaTodos         = signal(0);
  totalPaginasTodos   = signal(0);
  totalElementosTodos = signal(0);

  // ── Paginación computada ──────────────────────────────────────────────────
  paginaActual    = computed(() => this.paginacion().page);
  totalPaginas    = computed(() => this.paginacion().totalPaginas);
  totalElementos  = computed(() => this.paginacion().totalElementos);
  tamano          = computed(() => this.paginacion().size);

  /** Rango "Mostrando X – Y de Z" */
  desde = computed(() =>
    this.totalElementos() === 0 ? 0 : this.paginaActual() * this.tamano() + 1
  );
  hasta = computed(() =>
    Math.min(this.paginaActual() * this.tamano() + this.documentos().length, this.totalElementos())
  );

  /** Documentos filtrados por búsqueda (client-side — backend no soporta query) */
  filteredDocumentos = computed(() => {
    const q = this.searchText().toLowerCase();
    if (!q) return this.documentos();
    return this.documentos().filter(d =>
      d.numeroDocumento?.toLowerCase().includes(q) ||
      d.tipo.toLowerCase().includes(q)
    );
  });

  /** Ventana de hasta 5 páginas centrada en la actual */
  paginas = computed(() => {
    const total  = this.totalPaginas();
    const actual = this.paginaActual();
    if (total === 0) return [];
    const radio  = 2;
    let inicio   = Math.max(0, actual - radio);
    let fin      = Math.min(total - 1, actual + radio);
    // ajustar ventana si está al borde
    if (fin - inicio < radio * 2) {
      if (inicio === 0) fin   = Math.min(total - 1, radio * 2);
      else              inicio = Math.max(0, fin - radio * 2);
    }
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  });

  hayPaginaAnterior  = computed(() => this.paginaActual() > 0);
  hayPaginaSiguiente = computed(() => this.paginaActual() < this.totalPaginas() - 1);

  // ── Paginación vista "todos los movimientos" ──────────────────────────────
  desdeTodos = computed(() =>
    this.totalElementosTodos() === 0 ? 0 : this.paginaTodos() * this.tamanoTodos + 1
  );
  hastaTodos = computed(() =>
    Math.min(this.paginaTodos() * this.tamanoTodos + this.movimientosTodos().length, this.totalElementosTodos())
  );
  paginasTodos = computed(() => {
    const total  = this.totalPaginasTodos();
    const actual = this.paginaTodos();
    if (total === 0) return [];
    const radio  = 2;
    let inicio   = Math.max(0, actual - radio);
    let fin      = Math.min(total - 1, actual + radio);
    if (fin - inicio < radio * 2) {
      if (inicio === 0) fin    = Math.min(total - 1, radio * 2);
      else              inicio = Math.max(0, fin - radio * 2);
    }
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  });
  hayPaginaAnteriorTodos  = computed(() => this.paginaTodos() > 0);
  hayPaginaSiguienteTodos = computed(() => this.paginaTodos() < this.totalPaginasTodos() - 1);

  // ── KPIs derivados del listado de documentos ─────────────────────────────
  kpiEntradas      = computed(() => this.documentos().filter(d => d.tipo === 'ENTRADA').length);
  kpiSalidas       = computed(() => this.documentos().filter(d => d.tipo === 'SALIDA').length);
  kpiValorEntradas = computed(() =>
    this.documentos().filter(d => d.tipo === 'ENTRADA').reduce((acc, d) => acc + d.valorTotal, 0)
  );
  kpiBienesPagina  = computed(() =>
    this.documentos().reduce((acc, d) => acc + d.cantidadBienes, 0)
  );

  ngOnInit(): void {
    this.facade.loadAll();
  }

  // ── Toggle de vista ───────────────────────────────────────────────────────
  cambiarVista(v: Vista): void {
    this.vista.set(v);
    // Carga lazy: solo la primera vez que se selecciona "todos"
    if (v === 'todos' && !this.todosLoaded()) {
      this.cargarTodos();
    }
  }

  private cargarTodos(pagina = 0): void {
    this.loadingTodos.set(true);
    this.errorTodos.set(null);
    this.movimientosService.getMovimientos(pagina, this.tamanoTodos).subscribe({
      next: ({ movimientos, totalPaginas, totalElementos }) => {
        this.movimientosTodos.set(movimientos);
        this.paginaTodos.set(pagina);
        this.totalPaginasTodos.set(totalPaginas);
        this.totalElementosTodos.set(totalElementos);
        this.todosLoaded.set(true);
        this.loadingTodos.set(false);
      },
      error: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Error al cargar los movimientos';
        this.errorTodos.set(msg);
        this.loadingTodos.set(false);
      },
    });
  }

  irAPaginaTodos(page: number): void {
    if (page !== this.paginaTodos()) this.cargarTodos(page);
  }

  paginaAnteriorTodos(): void {
    if (this.hayPaginaAnteriorTodos()) this.cargarTodos(this.paginaTodos() - 1);
  }

  paginaSiguienteTodos(): void {
    if (this.hayPaginaSiguienteTodos()) this.cargarTodos(this.paginaTodos() + 1);
  }

  onSearch(query: string): void {
    this.searchText.set(query);
  }

  // ── Paginación ────────────────────────────────────────────────────────────
  irAPagina(page: number): void {
    this.facade.irAPaginaMovimientos(page);
  }

  paginaAnterior(): void {
    if (this.hayPaginaAnterior()) this.irAPagina(this.paginaActual() - 1);
  }

  paginaSiguiente(): void {
    if (this.hayPaginaSiguiente()) this.irAPagina(this.paginaActual() + 1);
  }

  // ── Helpers UI ────────────────────────────────────────────────────────────
  getVariant(estado: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (estado) {
      case 'Completado':  return 'success';
      case 'Pendiente':   return 'warning';
      case 'Cancelado':   return 'danger';
      default:            return 'info';
    }
  }

  getTipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      ENTRADA:          'Entrada',
      SALIDA:           'Salida',
      RESERVA:          'Reserva',
      LIBERACION:       'Liberación',
      AJUSTE:           'Ajuste',
      AJUSTE_POSITIVO:  'Ajuste (+)',
      AJUSTE_NEGATIVO:  'Ajuste (−)',
    };
    return map[tipo] ?? tipo;
  }

  /** Clase CSS para el badge de tipo en la vista plana */
  getTipoBadgeClass(tipo: TipoMovimiento): string {
    if (tipo === 'ENTRADA' || tipo === 'AJUSTE_POSITIVO') return 'type-badge--entrada';
    if (tipo === 'SALIDA'  || tipo === 'LIBERACION' || tipo === 'AJUSTE_NEGATIVO') return 'type-badge--salida';
    return 'type-badge--ajuste';
  }

  /** Clase CSS + signo para la columna cantidad en la vista plana */
  getCantidadClass(tipo: TipoMovimiento): string {
    if (tipo === 'ENTRADA' || tipo === 'AJUSTE_POSITIVO') return 'qty-val--entrada';
    if (tipo === 'SALIDA'  || tipo === 'LIBERACION' || tipo === 'AJUSTE_NEGATIVO') return 'qty-val--salida';
    return '';
  }

  getCantidadSigno(tipo: TipoMovimiento): string {
    if (tipo === 'ENTRADA' || tipo === 'AJUSTE_POSITIVO') return '+';
    if (tipo === 'SALIDA'  || tipo === 'LIBERACION' || tipo === 'AJUSTE_NEGATIVO') return '−';
    return '';
  }

  /** Ícono Lucide para el tipo de movimiento */
  getTipoIcon(tipo: TipoMovimiento): string {
    if (tipo === 'ENTRADA' || tipo === 'AJUSTE_POSITIVO') return 'arrow-down';
    if (tipo === 'SALIDA'  || tipo === 'LIBERACION' || tipo === 'AJUSTE_NEGATIVO') return 'arrow-up';
    return 'sliders-horizontal';
  }
}
