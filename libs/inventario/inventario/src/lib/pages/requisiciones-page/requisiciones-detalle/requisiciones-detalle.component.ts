import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'gastro-requisiciones-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  templateUrl: './requisiciones-detalle.component.html',
  styleUrls: ['./requisiciones-detalle.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RequisicionesDetalleComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  reqId = '0892';
  statusName = 'Despachada';
  statusClass = 'sheet-panel__status-badge--info';

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.reqId = id;
        
        // Mock status based on known IDs from dashboard
        if (['0895', '0896', '0897'].includes(id)) {
          this.statusName = 'Borrador';
          this.statusClass = 'sheet-panel__status-badge--borrador';
        } else if (['0892', '0893'].includes(id)) {
          this.statusName = 'Enviada';
          this.statusClass = 'sheet-panel__status-badge--enviada';
        } else if (id === '0890') {
          this.statusName = 'En Despacho';
          this.statusClass = 'sheet-panel__status-badge--info';
        } else if (['0888', '0885'].includes(id)) {
          this.statusName = 'Firmada';
          this.statusClass = 'sheet-panel__status-badge--success';
        }
      }
    });
  }

  close() {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
