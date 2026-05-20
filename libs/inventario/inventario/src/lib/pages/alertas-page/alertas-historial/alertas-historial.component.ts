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
import { LucideIconComponent, DataTableComponent, ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { AlertaPrioridad } from '../../../models/alerta.model';
import { AlertasFacade } from '../../../data-access/alertas.facade';

@Component({
  selector: 'restaurant-alertas-historial',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideIconComponent, DataTableComponent, ButtonComponent, BackButtonComponent],
  templateUrl: './alertas-historial.component.html',
  styleUrl: './alertas-historial.component.scss',
})
export class AlertasHistorialComponent implements OnInit {
  private router = inject(Router);
  private facade = inject(AlertasFacade);

  registros         = this.facade.historial;
  filtroBien        = signal<string>('');
  filtroResponsable = signal<string>('');

  total = computed(() => this.registros().length);

  filteredRegistros = computed(() => {
    const bien = this.filtroBien();
    const resp = this.filtroResponsable();
    return this.registros().filter(r => {
      const matchBien = !bien || r.bien.toLowerCase().includes(bien.toLowerCase());
      const matchResp = !resp || r.responsable.toLowerCase().includes(resp.toLowerCase());
      return matchBien && matchResp;
    });
  });

  ngOnInit(): void {
    this.facade.cargarHistorial();
  }

  // ── Helpers de UI ────────────────────────────────────────────────────────
  getPrioridadLabel(p: AlertaPrioridad): string {
    const map: Record<AlertaPrioridad, string> = {
      critica: 'Crítica (Mermas)',
      alta:    'Alta (Bajo Stock)',
      media:   'Media (Revisión)',
      baja:    'Baja',
    };
    return map[p];
  }

  getPrioridadClass(p: AlertaPrioridad): string {
    const map: Record<AlertaPrioridad, string> = {
      critica: 'badge--critico',
      alta:    'badge--alto',
      media:   'badge--medio',
      baja:    'badge--bajo',
    };
    return map[p];
  }

  getAccionClass(accion: string): string {
    if (accion.includes('Entrada'))  return 'accion--entrada';
    if (accion.includes('GIL'))      return 'accion--gil';
    if (accion.includes('Revisada')) return 'accion--revisada';
    return '';
  }

  getAccionIcon(accion: string): string {
    if (accion.includes('Entrada'))  return 'task_alt';
    if (accion.includes('GIL'))      return 'contract_edit';
    if (accion.includes('Revisada')) return 'visibility';
    return 'check';
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  volver(): void {
    this.router.navigate(['/app/inventario/alertas']);
  }

  onBienChange(event: Event): void {
    this.filtroBien.set((event.target as HTMLSelectElement).value);
  }

  onResponsableChange(event: Event): void {
    this.filtroResponsable.set((event.target as HTMLSelectElement).value);
  }

  exportarCSV(): void {
    // TODO(alertas-facade): llamar facade.exportarHistorialCSV()
    console.warn('exportarCSV: pendiente integración con AlertasFacade');
  }
}
