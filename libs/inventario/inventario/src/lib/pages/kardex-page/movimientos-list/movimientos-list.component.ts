import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KpiCardComponent, DataTableComponent, LucideIconComponent, ButtonComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';

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
  private facade = inject(KardexFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  documentos = this.facade.documentos;
  loading    = this.facade.loading;
  error      = this.facade.error;
  paginacion = this.facade.paginacion;
  searchText = signal<string>('');

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

  hayPaginaAnterior = computed(() => this.paginaActual() > 0);
  hayPaginaSiguiente = computed(() => this.paginaActual() < this.totalPaginas() - 1);

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
      ENTRADA:    'Entrada',
      SALIDA:     'Salida',
      RESERVA:    'Reserva',
      LIBERACION: 'Liberación',
      AJUSTE:     'Ajuste',
    };
    return map[tipo] ?? tipo;
  }
}
