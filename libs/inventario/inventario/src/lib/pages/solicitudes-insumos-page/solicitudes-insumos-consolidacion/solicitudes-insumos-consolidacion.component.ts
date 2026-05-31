import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { SolicitudesFacade } from '../../../data-access/solicitudes.facade';

interface ConsolidacionItem {
  id: string;
  nombre: string;
  icono: string;
  unidad: string;
  origenes: { solicitud: string; cantidad: number }[];
  total: number;
}

@Component({
  selector: 'restaurant-solicitudes-insumos-consolidacion',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, BackButtonComponent, StatusBadgeComponent],
  templateUrl: './solicitudes-insumos-consolidacion.component.html',
  styleUrls: ['./solicitudes-insumos-consolidacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesInsumosConsolidacionComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(SolicitudesFacade);

  readonly loading = this.facade.loadingSesion;

  origenes = computed(() =>
    [...new Set(this.facade.solicitudesSesion().map(s => s.fichaId))]
  );

  itemsConsolidados = computed<ConsolidacionItem[]>(() => {
    const map = new Map<string, ConsolidacionItem>();

    for (const solicitud of this.facade.solicitudesSesion()) {
      for (const item of solicitud.items) {
        const key = item.codigoSena;
        if (!map.has(key)) {
          map.set(key, {
            id:       key,
            nombre:   item.nombreBien ?? key,
            icono:    'inventory_2',
            unidad:   item.unidadMedida,
            origenes: [],
            total:    0,
          });
        }
        const entry = map.get(key)!;
        entry.origenes.push({ solicitud: solicitud.fichaId, cantidad: item.cantidad });
        entry.total += item.cantidad;
      }
    }

    return Array.from(map.values());
  });

  ngOnInit(): void {
    const sesionId = this.route.snapshot.paramMap.get('id');
    const filtros: { estado: string; instructorId?: string } = { estado: 'APROBADA' };
    // Pass the session id as a filter so only solicitudes for this session are loaded.
    // The backend accepts instructorId; a dedicated sesionId filter requires backend support.
    // TODO: replace with a sesionId filter once the backend exposes it.
    if (sesionId) {
      this.facade.cargarSolicitudSesionById(sesionId);
    }
    this.facade.cargarSolicitudesSesion(filtros);
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/solicitudes-insumos-page']);
  }

  onConfirm(): void {
    this.router.navigate(['/app/inventario/solicitudes-gil/generar']);
  }
}
