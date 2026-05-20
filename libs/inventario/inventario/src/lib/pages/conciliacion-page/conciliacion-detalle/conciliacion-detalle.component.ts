import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent, ButtonComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import {
  ConciliacionDetalle,
  DiferenciaItem,
} from '../../../models/conciliacion.model';
import {
  CONCILIACION_DETALLE_MOCK,
  DIFERENCIAS_MOCK,
} from '../../../models/conciliacion.mock';

@Component({
  selector: 'restaurant-conciliacion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    ButtonComponent,
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

  // Estado reactivo
  detalle = signal<ConciliacionDetalle | undefined>(CONCILIACION_DETALLE_MOCK);
  diferenciasList = signal<DiferenciaItem[]>(DIFERENCIAS_MOCK);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      // Si no hay ID en la ruta, regresa al historial
      this.router.navigate(['../historial'], { relativeTo: this.route });
      return;
    }

    // TODO: llamar a conciliacionFacade.cargarConciliacion(id)
    // Por ahora, usamos el mock centralizado
  }

  goBack(): void {
    this.location.back();
  }
}
