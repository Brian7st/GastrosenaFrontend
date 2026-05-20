import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  DataTableComponent,
  StatusBadgeComponent,
  LucideIconComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';
import {
  ActaLegalizacion,
  ActaEstado,
  MOCK_ACTAS,
} from '../../../models/acta.model';

@Component({
  selector: 'restaurant-actas-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DataTableComponent,
    StatusBadgeComponent,
    LucideIconComponent,
    ButtonComponent,
  ],
  templateUrl: './actas-list.component.html',
  styleUrl: './actas-list.component.scss',
})
export class ActasListComponent {
  private router = inject(Router);

  // ── Estado reactivo ──────────────────────────────────────────────────────
  allActas = signal<ActaLegalizacion[]>(MOCK_ACTAS);
  searchText = signal<string>('');
  estadoFilter = signal<string>('');
  fichaFilter = signal<string>('');

  // ── Actas filtradas ──────────────────────────────────────────────────────
  filteredActas = computed(() => {
    const text = this.searchText().toLowerCase();
    const estado = this.estadoFilter();
    const ficha = this.fichaFilter().toLowerCase();

    return this.allActas().filter(a => {
      const matchText = !text || a.instructor.toLowerCase().includes(text);
      const matchEstado = !estado || a.estado === estado;
      const matchFicha = !ficha || a.ficha.toLowerCase().includes(ficha);
      return matchText && matchEstado && matchFicha;
    });
  });

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getEstadoLabel(estado: ActaEstado): string {
    const map: Record<ActaEstado, string> = {
      borrador: 'Borrador',
      pendiente: 'Pendiente Firmas',
      firmada: 'Firmada',
      revisada: 'Revisada',
      archivada: 'Archivada',
    };
    return map[estado];
  }

  getEstadoVariant(estado: ActaEstado): 'success' | 'warning' | 'danger' | 'info' {
    const map: Record<ActaEstado, 'success' | 'warning' | 'danger' | 'info'> = {
      borrador: 'info',
      pendiente: 'warning',
      firmada: 'success',
      revisada: 'success',
      archivada: 'info',
    };
    return map[estado];
  }

  // ── Eventos de filtro ──────────────────────────────────────────────────
  onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  onEstadoChange(event: Event): void {
    this.estadoFilter.set((event.target as HTMLSelectElement).value);
  }

  onFichaChange(event: Event): void {
    this.fichaFilter.set((event.target as HTMLInputElement).value);
  }

  limpiarFiltros(): void {
    this.searchText.set('');
    this.estadoFilter.set('');
    this.fichaFilter.set('');
  }

  // ── Navegación ─────────────────────────────────────────────────────────
  crearActa(): void {
    this.router.navigate(['/app/inventario/actas/nueva']);
  }

  irADetalle(id: string): void {
    this.router.navigate(['/app/inventario/actas', id]);
  }
}
