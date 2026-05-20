import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  KpiCardComponent,
  DataTableComponent,
  LucideIconComponent,
  ButtonComponent,
  StatusBadgeComponent,
} from '@restaurant/shared/ui';
import {
  Programa,
  PresupuestoResumen,
  VencimientoProximo,
  EjecucionMensual,
} from '../../../models/presupuesto.model';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';
import { OnInit, inject } from '@angular/core';
import { FormatoMonedaPipe } from '../../../pipes/formato-moneda.pipe';

@Component({
  selector: 'restaurant-presupuesto-dashboard',
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
    FormatoMonedaPipe,
  ],
  templateUrl: './presupuesto-dashboard.component.html',
  styleUrl: './presupuesto-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoDashboardComponent implements OnInit {
  public facade = inject(PresupuestoFacade);

  /** Datos de resumen presupuestal */
  resumen = this.facade.resumen;

  /** Programas con sus rubros (tabla colapsable) */
  programas = this.facade.programas;

  /** Estado de expansión por programa id */
  expandidos = signal<Record<string, boolean>>({
    'PRG-001': true,
    'PRG-002': false,
    'PRG-003': false,
  });

  /** Historial de afectaciones */
  afectaciones = this.facade.afectaciones;

  /** Próximos vencimientos */
  vencimientos = this.facade.vencimientos;

  /** Ejecución mensual para gráfico de barras */
  ejecucionMensual = this.facade.ejecucionMensual;

  ngOnInit(): void {
    this.facade.loadAll();
  }

  /** Toggle de grupo colapsable */
  togglePrograma(programaId: string): void {
    this.expandidos.update(prev => ({
      ...prev,
      [programaId]: !prev[programaId],
    }));
  }

  /** Helper: verificar si programa está expandido */
  isExpanded(programaId: string): boolean {
    return this.expandidos()[programaId] ?? false;
  }

  /** Helper: clase CSS del badge de ejecución */
  getEjecucionClass(porcentaje: number): string {
    if (porcentaje >= 90) return 'ejecucion-danger';
    if (porcentaje >= 70) return 'ejecucion-warning';
    return 'ejecucion-success';
  }

  /** Helper: configuración unificada para badges de tipo de afectación */
  getTipoConfig(tipo: string): { status: 'info'|'success'|'warning'|'danger'; cssClass: string } {
    switch (tipo.toLowerCase()) {
      case 'pago':
        return { status: 'success', cssClass: 'tipo-badge--pago' };
      case 'traslado':
        return { status: 'warning', cssClass: 'tipo-badge--traslado' };
      case 'anulación':
      case 'anulacion':
        return { status: 'danger', cssClass: 'tipo-badge--anulacion' };
      case 'compromiso':
      default:
        return { status: 'info', cssClass: 'tipo-badge--compromiso' };
    }
  }

  /** Helper: clase CSS para urgencia de vencimiento */
  getUrgenciaClass(urgencia: string): string {
    switch (urgencia) {
      case 'critico': return 'vencimiento-card--critico';
      case 'proximo': return 'vencimiento-card--proximo';
      default:        return 'vencimiento-card--normal';
    }
  }
}
