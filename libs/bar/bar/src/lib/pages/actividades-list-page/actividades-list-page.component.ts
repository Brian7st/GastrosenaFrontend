import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchFilterComponent, LucideIconComponent } from '@restaurant/shared/ui';
import { BarFacade } from '../../data-access/bar.facade';

@Component({
  selector: 'restaurant-bar-actividades-list-page',
  standalone: true,
  imports: [CommonModule, SearchFilterComponent, LucideIconComponent],
  templateUrl: './actividades-list-page.component.html',
  styleUrl: './actividades-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActividadesListPageComponent {
  private facade = inject(BarFacade);
  private router = inject(Router);

  readonly actividades = this.facade.actividades;

  /** Filtro por número de ficha */
  readonly filtroFicha = signal<string>('');

  /** Actividades filtradas por ficha */
  readonly actividadesFiltradas = computed(() => {
    const filtro = this.filtroFicha().trim();
    if (!filtro) return this.actividades();
    return this.actividades().filter(a => a.ficha.includes(filtro));
  });

  onFiltroChange(valor: string): void {
    this.filtroFicha.set(valor);
  }

  volver(): void {
    this.router.navigate(['/app/bar/actividad']);
  }

  irAEvaluacion(actividadId: number): void {
    this.router.navigate(['/app/bar/evaluacion-masiva'], {
      queryParams: { actividadId },
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Activa':     return 'estado-activa';
      case 'Finalizada': return 'estado-finalizada';
      case 'Pendiente':  return 'estado-pendiente';
      default:           return '';
    }
  }

  eliminarActividad(id: number, event: Event): void {
    event.stopPropagation();
    this.facade.eliminarActividad(id);
  }
}
