import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-consolidado-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, KpiCardComponent],
  templateUrl: './consolidado-list.component.html',
  styleUrl: './consolidado-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidadoListComponent {
  private router = inject(Router);

  // Mocks para la tabla de consolidados históricos
  consolidados = [
    { id: '#CON-2023-12-01', mes: 'Diciembre 2023', tipo: 'Cierre Anual', total: '$45,200,000.00', estado: 'Contabilizado', estadoCss: 'badge--success-soft' },
    { id: '#CON-2023-11-28', mes: 'Noviembre 2023', tipo: 'Regular', total: '$38,150,000.00', estado: 'Generado', estadoCss: 'badge--info-soft' },
    { id: '#CON-2023-10-15', mes: 'Octubre 2023', tipo: 'Regular', total: '$29,400,000.00', estado: 'Borrador', estadoCss: 'badge--surface' },
    { id: '#CON-2023-09-30', mes: 'Septiembre 2023', tipo: 'Regular', total: '$41,200,000.00', estado: 'Contabilizado', estadoCss: 'badge--success-soft' }
  ];

  goToDetail(id: string): void {
    this.router.navigate(['/app/inventario/consolidado', id.replace('#CON-', '')]);
  }
}
