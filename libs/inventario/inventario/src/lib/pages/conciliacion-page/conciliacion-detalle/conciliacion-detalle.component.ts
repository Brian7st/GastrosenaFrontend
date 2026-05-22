import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent, ButtonComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ConciliacionFacade } from '../../../data-access/conciliacion.facade';

@Component({
  selector: 'restaurant-conciliacion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    KpiCardComponent,
    BackButtonComponent,
  ],
  templateUrl: './conciliacion-detalle.component.html',
  styleUrl: './conciliacion-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionDetalleComponent implements OnInit {
  private location = inject(Location);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(ConciliacionFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  detalle = this.facade.conciliacionSeleccionada;
  diferenciasList = this.facade.diferenciasList;
  loading = this.facade.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['../historial'], { relativeTo: this.route });
      return;
    }
    this.facade.cargarConciliacion(id);
  }

  goBack(): void {
    this.location.back();
  }
}
