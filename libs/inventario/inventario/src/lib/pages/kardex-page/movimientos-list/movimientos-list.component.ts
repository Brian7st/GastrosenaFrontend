import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KpiCardComponent, DataTableComponent, LucideIconComponent, ButtonComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';

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
    StatusBadgeComponent
  ],
  templateUrl: './movimientos-list.component.html',
  styleUrl: './movimientos-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientosListComponent implements OnInit {
  private facade = inject(KardexFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  movimientos = this.facade.movimientos;
  loading     = this.facade.loading;
  paginacion  = this.facade.paginacion;
  tipoActivo  = this.facade.tipoFiltro;

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
    Math.min(this.paginaActual() * this.tamano() + this.movimientos().length, this.totalElementos())
  );

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

  // ── KPIs derivados del listado cargado ───────────────────────────────────
  kpiEntradas      = computed(() => this.movimientos().filter(m => m.tipo === 'ENTRADA').length);
  kpiSalidas       = computed(() => this.movimientos().filter(m => m.tipo === 'SALIDA').length);
  kpiValorEntradas = computed(() =>
    this.movimientos().filter(m => m.tipo === 'ENTRADA').reduce((acc, m) => acc + m.valor, 0)
  );
  kpiPendientes    = computed(() => this.movimientos().filter(m => m.estado === 'Pendiente').length);

  ngOnInit(): void {
    this.facade.loadAll();
  }

  // ── Filtro por tipo ───────────────────────────────────────────────────────
  filtrar(tipo: string | undefined): void {
    this.facade.filtrarPorTipo(tipo);
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
