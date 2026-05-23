import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  DataTableComponent,
  StatusBadgeComponent,
  LucideIconComponent,
  KpiCardComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';
import { PaqueteProbatorio, PaqueteEstado } from '../../../models/paquete.model';
import { PaqueteFacade } from '../../../data-access/paquete.facade';

@Component({
  selector: 'restaurant-paquete-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DataTableComponent,
    StatusBadgeComponent,
    LucideIconComponent,
    KpiCardComponent,
    ButtonComponent,
  ],
  templateUrl: './paquete-list.component.html',
  styleUrl: './paquete-list.component.scss',
})
export class PaqueteListComponent implements OnInit {
  private router = inject(Router);
  private facade = inject(PaqueteFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  allPaquetes    = this.facade.paquetes;
  loading        = this.facade.loading;
  searchText     = signal<string>('');
  estadoFilter   = signal<string>('');
  programaFilter = signal<string>('');

  ngOnInit(): void {
    this.facade.loadAll();
  }

  // ── Paquetes filtrados ───────────────────────────────────────────────────
  filteredPaquetes = computed(() => {
    const text     = this.searchText().toLowerCase();
    const estado   = this.estadoFilter();
    const programa = this.programaFilter().toLowerCase();

    return this.allPaquetes().filter(p => {
      const matchText =
        !text ||
        p.expediente.toLowerCase().includes(text) ||
        p.responsable.toLowerCase().includes(text) ||
        p.ficha.toLowerCase().includes(text);
      const matchEstado   = !estado   || p.estado === estado;
      const matchPrograma = !programa || p.programa.toLowerCase().includes(programa);
      return matchText && matchEstado && matchPrograma;
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
      ARCHIVADO:  'Archivado',
    };
    return map[estado];
  }

  getEstadoVariant(estado: PaqueteEstado): 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<PaqueteEstado, 'success' | 'warning' | 'danger' | 'info'> = {
      INCOMPLETO: 'danger',
      COMPLETO:   'success',
      ARCHIVADO:  'info',
    };
    return map[estado];
  }

  getDocsCompletados(p: PaqueteProbatorio): number {
    return p.documentos.filter(d => d.vinculado).length;
  }

  getIniciales(p: PaqueteProbatorio): string {
    if (p.responsableIniciales) return p.responsableIniciales;
    return p.responsable
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

  onProgramaChange(event: Event): void {
    this.programaFilter.set((event.target as HTMLSelectElement).value);
  }

  limpiarFiltros(): void {
    this.searchText.set('');
    this.estadoFilter.set('');
    this.programaFilter.set('');
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  crearPaquete(): void {
    this.router.navigate(['/app/inventario/paquete-probatorio/nuevo']);
  }

  irADetalle(id: string): void {
    this.router.navigate(['/app/inventario/paquete-probatorio', id]);
  }
}
