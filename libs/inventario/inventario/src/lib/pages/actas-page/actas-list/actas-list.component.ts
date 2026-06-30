import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
  OnInit,
} from '@angular/core';

import { Router } from '@angular/router';
import {
  DataTableComponent,
  StatusBadgeComponent,
  LucideIconComponent,
  ButtonComponent,
  HasPermissionDirective,
} from '@restaurant/shared/ui';
import { ActaEstado } from '../../../models/acta.model';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';
import { ActasFacade } from '../../../data-access/actas.facade';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-actas-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataTableComponent,
    StatusBadgeComponent,
    LucideIconComponent,
    ButtonComponent,
    HasPermissionDirective,
    EmptyStateComponent,
  ],
  templateUrl: './actas-list.component.html',
  styleUrl: './actas-list.component.scss',
})
export class ActasListComponent implements OnInit {
  private router = inject(Router);
  protected readonly i18n = inject(I18nService);
  private facade = inject(ActasFacade);

  // ── Estado reactivo ──────────────────────────────────────────────────────
  allActas    = this.facade.actas;
  loading     = this.facade.loading;
  searchText  = signal<string>('');
  estadoFilter = signal<string>('');
  fichaFilter  = signal<string>('');

  ngOnInit(): void {
    this.facade.loadAll();
  }

  // ── Actas filtradas ──────────────────────────────────────────────────────
  filteredActas = computed(() => {
    const text   = this.searchText().toLowerCase();
    const estado = this.estadoFilter();
    const ficha  = this.fichaFilter().toLowerCase();

    return this.allActas().filter(a => {
      const matchText   = !text   || a.instructorId.toLowerCase().includes(text);
      const matchEstado = !estado || a.estado === estado;
      const matchFicha  = !ficha  || a.fichaId.toLowerCase().includes(ficha);
      return matchText && matchEstado && matchFicha;
    });
  });

  // ── Paginación cliente ─────────────────────────────────────────────────────
  readonly ITEMS_POR_PAGINA = 10;
  paginaActual = signal(1);

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.filteredActas().length / this.ITEMS_POR_PAGINA))
  );

  actasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.ITEMS_POR_PAGINA;
    return this.filteredActas().slice(inicio, inicio + this.ITEMS_POR_PAGINA);
  });

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  irAPagina(n: number): void {
    if (n >= 1 && n <= this.totalPaginas()) { this.paginaActual.set(n); }
  }
  anterior(): void { this.irAPagina(this.paginaActual() - 1); }
  siguiente(): void { this.irAPagina(this.paginaActual() + 1); }
  minOf(a: number, b: number): number { return Math.min(a, b); }

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getEstadoLabel(estado: ActaEstado): string {
    const map: Record<ActaEstado, string> = {
      BORRADOR:         'Borrador',
      PENDIENTE_FIRMAS: 'Pendiente Firmas',
      FIRMADA:          'Firmada',
      REVISADA:         'Revisada',
      ARCHIVADA:        'Archivada',
    };
    return map[estado];
  }

  getEstadoVariant(estado: ActaEstado): 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<ActaEstado, 'success' | 'warning' | 'danger' | 'info'> = {
      BORRADOR:         'info',
      PENDIENTE_FIRMAS: 'warning',
      FIRMADA:          'success',
      REVISADA:         'success',
      ARCHIVADA:        'info',
    };
    return map[estado];
  }

  // ── Eventos de filtro ────────────────────────────────────────────────────
  onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
    this.paginaActual.set(1);
  }

  onEstadoChange(event: Event): void {
    this.estadoFilter.set((event.target as HTMLSelectElement).value);
    this.paginaActual.set(1);
  }

  onFichaChange(event: Event): void {
    this.fichaFilter.set((event.target as HTMLInputElement).value);
    this.paginaActual.set(1);
  }

  limpiarFiltros(): void {
    this.searchText.set('');
    this.estadoFilter.set('');
    this.fichaFilter.set('');
    this.paginaActual.set(1);
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  crearActa(): void {
    this.router.navigate(['/app/inventario/actas/nueva']);
  }

  irADetalle(id: string): void {
    this.router.navigate(['/app/inventario/actas', id]);
  }
}
