import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import {
  LucideIconComponent,
  KpiCardComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';

@Component({
  selector: 'restaurant-requisiciones-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    LucideIconComponent,
    KpiCardComponent,
    ButtonComponent
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
