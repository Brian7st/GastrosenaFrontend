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
  AfectacionPresupuestal,
  VencimientoProximo,
  EjecucionMensual,
  MOCK_RESUMEN,
  MOCK_PROGRAMAS,
  MOCK_AFECTACIONES,
  MOCK_VENCIMIENTOS,
  MOCK_EJECUCION_MENSUAL,
} from '../../../models/presupuesto.model';

@Component({
  selector: 'inventario-presupuesto-dashboard',
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
  ],
  templateUrl: './presupuesto-dashboard.component.html',
  styleUrls: ['./presupuesto-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoDashboardComponent {
  /** Datos de resumen presupuestal */
  resumen = signal<PresupuestoResumen>(MOCK_RESUMEN);

  /** Programas con sus rubros (tabla colapsable) */
  programas = signal<Programa[]>(MOCK_PROGRAMAS);

  /** Estado de expansión por programa id */
  expandidos = signal<Record<string, boolean>>({
    'PRG-001': true,
    'PRG-002': false,
    'PRG-003': false,
  });

  /** Historial de afectaciones */
  afectaciones = signal<AfectacionPresupuestal[]>(MOCK_AFECTACIONES);

  /** Próximos vencimientos */
  vencimientos = signal<VencimientoProximo[]>(MOCK_VENCIMIENTOS);

  /** Ejecución mensual para gráfico de barras */
  ejecucionMensual = signal<EjecucionMensual[]>(MOCK_EJECUCION_MENSUAL);

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

  /** Helper: formateo de moneda (para template) */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /** Helper: formato compacto para KPI cards ($2.450M, $15.6M, $892K) */
  formatCompact(value: number): string {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1_000_000_000) {
      return `${sign}$${(abs / 1_000_000_000).toFixed(1).replace('.', ',')}B`;
    }
    if (abs >= 1_000_000) {
      return `${sign}$${(abs / 1_000_000).toFixed(0)}M`;
    }
    if (abs >= 1_000) {
      return `${sign}$${(abs / 1_000).toFixed(0)}K`;
    }
    return `${sign}$${abs}`;
  }

  /** Helper: clase CSS del badge de ejecución */
  getEjecucionClass(porcentaje: number): string {
    if (porcentaje >= 90) return 'ejecucion-danger';
    if (porcentaje >= 70) return 'ejecucion-warning';
    return 'ejecucion-success';
  }

  /** Helper: mapeo de tipo de afectación a estado de badge */
  getTipoBadgeStatus(tipo: string): 'info' | 'success' | 'warning' | 'danger' {
    switch (tipo.toLowerCase()) {
      case 'pago': return 'success';
      case 'traslado': return 'warning';
      case 'anulación': return 'danger';
      case 'compromiso': 
      default: return 'info';
    }
  }

  /** Helper: clase CSS del badge de tipo afectación */
  getTipoBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'Compromiso': return 'tipo-badge--compromiso';
      case 'Pago':       return 'tipo-badge--pago';
      case 'Traslado':   return 'tipo-badge--traslado';
      case 'Anulación':  return 'tipo-badge--anulacion';
      default:           return '';
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
