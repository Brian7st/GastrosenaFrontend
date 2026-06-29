import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
  OnInit,
} from '@angular/core';

import { RouterModule, Router } from '@angular/router';
import {
  KpiCardComponent,
  ButtonComponent,
  StatusBadgeComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import {
  AlertaPrioridad
} from '../../../models/alerta.model';
import { AlertasFacade } from '../../../data-access/alertas.facade';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-alertas-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, KpiCardComponent, ButtonComponent, StatusBadgeComponent, LucideIconComponent, EmptyStateComponent],
  templateUrl: './alertas-list.component.html',
  styleUrl: './alertas-list.component.scss',
})
export class AlertasListComponent implements OnInit {
  private router = inject(Router);
  protected readonly i18n = inject(I18nService);
  private facade = inject(AlertasFacade);

  // ── Estado reactivo ──────────────────────────────────────────────────────
  allAlertas = this.facade.alertas;
  searchText     = signal<string>('');
  prioridadFilter = signal<string>('');
  estadoFilter    = signal<string>('');

  // Resumen real de alertas (GET /reporting/alertas/resumen)
  resumen = this.facade.resumenAlertas;

  ngOnInit(): void {
    this.facade.loadAll();
    this.facade.cargarResumen();
  }

  // ── KPIs computados ──────────────────────────────────────────────────────
  kpiCriticas = computed(() =>
    this.allAlertas().filter(a => a.estado === 'CRITICA').length
  );
  kpiActivas = computed(() =>
    this.allAlertas().filter(a => a.estado === 'ACTIVA').length
  );

  // ── Alertas filtradas ────────────────────────────────────────────────────
  filteredAlertas = computed(() => {
    const text  = this.searchText().toLowerCase();
    const prio  = this.prioridadFilter();
    const estado = this.estadoFilter();

    return this.allAlertas().filter(a => {
      const matchText   = !text  || (a.nombreBien?.toLowerCase().includes(text) ?? false) || (a.codigoSena?.toLowerCase().includes(text) ?? false);
      const matchPrio   = !prio  || a.prioridad === prio;
      const matchEstado = !estado || a.estado === estado;
      return matchText && matchPrio && matchEstado;
    });
  });

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getPrioridadLabel(p: AlertaPrioridad): string {
    const map: Record<AlertaPrioridad, string> = {
      ALTA:  'Alta',
      MEDIA: 'Media',
      BAJA:  'Baja',
    };
    return map[p];
  }

  getPrioridadVariant(p: AlertaPrioridad): 'danger' | 'warning' | 'info' | 'success' {
    const map: Record<AlertaPrioridad, 'danger' | 'warning' | 'info' | 'success'> = {
      ALTA:  'warning',
      MEDIA: 'info',
      BAJA:  'success',
    };
    return map[p];
  }

  formatValor(v: number): string {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v}`;
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  irADetalle(id: string): void {
    this.router.navigate(['/app/inventario/alertas', id]);
  }

  irAResolver(event: Event, id: string): void {
    event.stopPropagation();
    this.router.navigate(['/app/inventario/alertas', id, 'resolver']);
  }

  irAConfig(): void {
    this.router.navigate(['/app/inventario/alertas/configuracion']);
  }

  /** Descarga el historial de alertas en CSV (generado en cliente). */
  onExportarCSV(): void {
    this.facade.exportarHistorialCSV();
  }

  onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  onPrioridadChange(event: Event): void {
    this.prioridadFilter.set((event.target as HTMLSelectElement).value);
  }

  onEstadoChange(event: Event): void {
    this.estadoFilter.set((event.target as HTMLSelectElement).value);
  }
}
