import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';

import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';

@Component({
  selector: 'restaurant-requisiciones-detalle',
  standalone: true,
  imports: [RouterModule, LucideIconComponent],
  templateUrl: './requisiciones-detalle.component.html',
  styleUrl: './requisiciones-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDetalleComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(RequisicionesFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  requisicion = this.facade.requisicionSeleccionada;
  loading     = this.facade.loading;
  /** Expuesto para el template (usa reqId() en dos lugares) */
  reqId       = computed(() => this.requisicion()?.id ?? '');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarRequisicion(id);
    } else {
      this.router.navigate(['/app/inventario/requisiciones']);
    }
  }

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
