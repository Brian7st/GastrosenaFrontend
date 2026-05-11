import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'gastro-requisiciones-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  templateUrl: './requisiciones-detalle.component.html',
  styleUrls: ['./requisiciones-detalle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDetalleComponent {
  private router = inject(Router);

  close() {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
