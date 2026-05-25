import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

interface ConsolidacionItem {
  id: string;
  nombre: string;
  icono: string;
  unidad: string;
  origenes: {
    solicitud: string;
    cantidad: number;
  }[];
  total: number;
}

@Component({
  selector: 'restaurant-solicitudes-insumos-consolidacion',
  standalone: true,
  imports: [RouterModule, ButtonComponent, BackButtonComponent],
  templateUrl: './solicitudes-insumos-consolidacion.component.html',
  styleUrls: ['./solicitudes-insumos-consolidacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesInsumosConsolidacionComponent {
  private router = inject(Router);

  // Mocks
  origenes = signal<string[]>(['SOL-001', 'SOL-002']);
  
  itemsConsolidados = signal<ConsolidacionItem[]>([
    {
      id: '1',
      nombre: 'Harina de Trigo',
      icono: 'bakery_dining',
      unidad: 'kg',
      origenes: [
        { solicitud: 'SOL-001', cantidad: 10 },
        { solicitud: 'SOL-002', cantidad: 15 }
      ],
      total: 25
    },
    {
      id: '2',
      nombre: 'Aceite Vegetal',
      icono: 'oil_barrel',
      unidad: 'L',
      origenes: [
        { solicitud: 'SOL-001', cantidad: 5 }
      ],
      total: 5
    },
    {
      id: '3',
      nombre: 'Sal Marina',
      icono: 'grain',
      unidad: 'kg',
      origenes: [
        { solicitud: 'SOL-001', cantidad: 2 },
        { solicitud: 'SOL-002', cantidad: 3 }
      ],
      total: 5
    }
  ]);

  goBack(): void {
    // Regresa a la bandeja de aprobación principal
    this.router.navigate(['/app/inventario/solicitudes-insumos-page']);
  }

  onConfirm(): void {
    console.log('Confirmar y Generar GIL');
    // Implementar lógica en el futuro
  }
}
