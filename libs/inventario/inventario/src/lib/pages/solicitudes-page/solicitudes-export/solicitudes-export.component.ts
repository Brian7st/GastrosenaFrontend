import { Component, ChangeDetectionStrategy, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

@Component({
  selector: 'restaurant-solicitudes-export',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './solicitudes-export.component.html',
  styleUrl: './solicitudes-export.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesExportComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(SolicitudesFacade);

  solicitud   = this.facade.solicitudSeleccionada;
  loading     = this.facade.loading;
  solicitudId = computed(() => this.solicitud()?.numeroGil ?? '');

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.facade.cargarSolicitudById(paramId);
    }
  }

  onClose(): void {
    const rawId = this.route.snapshot.paramMap.get('id') ?? '';
    this.router.navigate(['/app/inventario/solicitudes-gil', rawId]);
  }
}
