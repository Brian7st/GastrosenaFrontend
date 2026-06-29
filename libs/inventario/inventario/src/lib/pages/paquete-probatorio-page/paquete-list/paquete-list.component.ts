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
  KpiCardComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';
import { PaqueteProbatorio, PaqueteEstado } from '../../../models/paquete.model';
import { EmptyStateComponent } from '../../../components/empty-state/empty-state.component';
import { PaqueteFacade } from '../../../data-access/paquete.facade';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-paquete-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataTableComponent,
    StatusBadgeComponent,
    LucideIconComponent,
    KpiCardComponent,
    ButtonComponent,
    EmptyStateComponent,
],
  templateUrl: './paquete-list.component.html',
  styleUrl: './paquete-list.component.scss',
})
export class PaqueteListComponent implements OnInit {
  private router = inject(Router);
  protected readonly i18n = inject(I18nService);
  private facade = inject(PaqueteFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  allPaquetes    = this.facade.paquetes;
  loading        = this.facade.loading;
  searchText   = signal<string>('');
  estadoFilter = signal<string>('');

  ngOnInit(): void {
    this.facade.loadAll();
  }

  // ── Paquetes filtrados ───────────────────────────────────────────────────
  filteredPaquetes = computed(() => {
    const text   = this.searchText().toLowerCase();
    const estado = this.estadoFilter();

    return this.allPaquetes().filter(p => {
      const matchText =
        !text ||
        p.expediente.toLowerCase().includes(text) ||
        p.instructorId.toLowerCase().includes(text) ||
        p.fichaId.toLowerCase().includes(text);
      const matchEstado = !estado || p.estado === estado;
      return matchText && matchEstado;
    });
  });

  // ── KPIs computados ──────────────────────────────────────────────────────
  kpiTotal     = computed(() => this.allPaquetes().length);
  kpiIncompleto = computed(() => this.allPaquetes().filter(p => p.estado === 'INCOMPLETO').length);
  kpiCompleto   = computed(() => this.allPaquetes().filter(p => p.estado === 'COMPLETO').length);
  kpiArchivado  = computed(() => this.allPaquetes().filter(p => p.estado === 'ARCHIVADO').length);

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getEstadoLabel(estado: PaqueteEstado): string {
    const map: Record<PaqueteEstado, string> = {
      INCOMPLETO: 'Incompleto',
      COMPLETO:   'Completo',
      REVISADO:   'Revisado',
      ARCHIVADO:  'Archivado',
    };
    return map[estado];
  }

  getEstadoVariant(estado: PaqueteEstado): 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<PaqueteEstado, 'success' | 'warning' | 'danger' | 'info'> = {
      INCOMPLETO: 'danger',
      COMPLETO:   'success',
      REVISADO:   'success',
      ARCHIVADO:  'info',
    };
    return map[estado];
  }

  getDocsCompletados(p: PaqueteProbatorio): number {
    return (p.actaId ? 1 : 0) + (p.requisicionId ? 1 : 0) + (p.registroAsistenciaAdjunto ? 1 : 0);
  }

  getIniciales(p: PaqueteProbatorio): string {
    return p.instructorId
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // ── Eventos de filtro ────────────────────────────────────────────────────
  onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  onEstadoChange(event: Event): void {
    this.estadoFilter.set((event.target as HTMLSelectElement).value);
  }

  limpiarFiltros(): void {
    this.searchText.set('');
    this.estadoFilter.set('');
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  crearPaquete(): void {
    this.router.navigate(['/app/inventario/paquete-probatorio/nuevo']);
  }

  irADetalle(id: string): void {
    this.router.navigate(['/app/inventario/paquete-probatorio', id]);
  }
}
