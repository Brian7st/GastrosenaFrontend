import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  ButtonComponent,
  EmptyStateComponent,
  LoadingSkeletonComponent,
  PageHeaderComponent,
  SectionTitleComponent,
  StatusBadgeComponent,
} from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

@Component({
  selector: 'restaurant-solicitudes-insumos-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    EmptyStateComponent,
    LoadingSkeletonComponent,
    PageHeaderComponent,
    SectionTitleComponent,
    StatusBadgeComponent,
    BackButtonComponent,
  ],
  templateUrl: './solicitudes-insumos-detail.component.html',
  styleUrls: ['./solicitudes-insumos-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesInsumosDetailComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  readonly facade = inject(SolicitudesFacade);

  readonly solicitud  = this.facade.solicitudSesionSeleccionada;
  readonly loading    = this.facade.loadingSesion;
  readonly totalItems = computed(() => this.solicitud()?.items.length ?? 0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.facade.cargarSolicitudSesionById(id);
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/solicitudes-insumos-page']);
  }

  onEdit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.router.navigate(['/app/inventario/solicitudes-insumos-page', id, 'editar']);
  }

  getEstadoVariant(estado: string): 'warning' | 'success' | 'neutral' | 'danger' {
    const map: Record<string, 'warning' | 'success' | 'neutral' | 'danger'> = {
      CREADA:       'warning',
      APROBADA:     'success',
      RECHAZADA:    'danger',
      COMPROMETIDA: 'success',
    };
    return map[estado] ?? 'neutral';
  }
}
