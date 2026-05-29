import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-requisiciones-resumen',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './requisiciones-resumen.component.html',
  styleUrl: './requisiciones-resumen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesResumenComponent {
  private router = inject(Router);

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
