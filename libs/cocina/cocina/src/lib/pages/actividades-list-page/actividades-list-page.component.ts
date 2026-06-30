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
import { I18nService } from '../../i18n/i18n.service';

import { CocinaFacade } from '../../data-access/cocina.facade';

@Component({
  selector: 'restaurant-actividades-list-page',
  standalone: true,
  imports: [CommonModule, SearchFilterComponent, LucideIconComponent],
  templateUrl: './actividades-list-page.component.html',
  styleUrl: './actividades-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActividadesListPageComponent {
  protected readonly i18n = inject(I18nService);
  private facade = inject(CocinaFacade);
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
    this.router.navigate(['/app/cocina/actividad']);
  }

  irAEvaluacion(actividadId: number): void {
    this.router.navigate(['/app/cocina/evaluacion-masiva'], {
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
