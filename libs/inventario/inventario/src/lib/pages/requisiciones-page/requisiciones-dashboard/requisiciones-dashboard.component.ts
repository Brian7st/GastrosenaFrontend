import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import {
  LucideIconComponent,
  KpiCardComponent,
  ButtonComponent,
  HasPermissionDirective,
} from '@restaurant/shared/ui';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';

@Component({
  selector: 'restaurant-requisiciones-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    LucideIconComponent,
    KpiCardComponent,
    ButtonComponent,
    HasPermissionDirective
],
  templateUrl: './requisiciones-dashboard.component.html',
  styleUrl: './requisiciones-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDashboardComponent implements OnInit {
  private router = inject(Router);
  private facade = inject(RequisicionesFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  requisiciones = this.facade.requisiciones;
  loading       = this.facade.loading;

  // ── KPIs computados ──────────────────────────────────────────────────────
  kpiBorradores = this.facade.kpiBorradores;
  kpiEnviadas   = this.facade.kpiEnviadas;
  kpiEnDespacho = this.facade.kpiEnDespacho;
  kpiFirmadas   = this.facade.kpiFirmadas;

  // ── Grupos para el tablero kanban ─────────────────────────────────────────
  borradores = computed(() => this.requisiciones().filter(r => r.estado === 'BORRADOR'));
  enviadas   = computed(() => this.requisiciones().filter(r => r.estado === 'ENVIADA'));
  enDespacho = computed(() => this.requisiciones().filter(r => r.estado === 'DESPACHADA'));
  firmadas   = computed(() => this.requisiciones().filter(r => r.estado === 'FIRMADA'));

  ngOnInit(): void {
    this.facade.loadAll();
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  crearRequisicion(): void {
    this.router.navigate(['/app/inventario/requisiciones/nueva']);
  }

  irADetalle(id: string): void {
    this.router.navigate(['/app/inventario/requisiciones', id]);
  }
}
