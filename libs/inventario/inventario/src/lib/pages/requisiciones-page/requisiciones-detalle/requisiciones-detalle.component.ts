import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';
import { RequisicionesService } from '../../../data-access/services/requisiciones.service';

@Component({
  selector: 'restaurant-requisiciones-detalle',
  standalone: true,
  imports: [RouterModule, LucideIconComponent],
  templateUrl: './requisiciones-detalle.component.html',
  styleUrl: './requisiciones-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDetalleComponent implements OnInit {
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private facade  = inject(RequisicionesFacade);
  private service = inject(RequisicionesService);

  // ── Estado reactivo ──────────────────────────────────────────────────────
  requisicion = this.facade.requisicionSeleccionada;
  loading     = this.facade.loading;
  reqId       = computed(() => this.requisicion()?.id ?? '');
  estado      = computed(() => this.requisicion()?.estado);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarRequisicion(id);
    } else {
      this.router.navigate(['/app/inventario/requisiciones']);
    }
  }

  /** POST /legalization/requisiciones/{id}/exportar — descarga el soporte .docx */
  exportar(): void {
    const id = this.reqId();
    if (!id) return;
    this.service.exportarRequisicion(id).subscribe({
      error: (err) => console.error('[RequisicionesDetalle] Error al exportar:', err),
    });
  }

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
