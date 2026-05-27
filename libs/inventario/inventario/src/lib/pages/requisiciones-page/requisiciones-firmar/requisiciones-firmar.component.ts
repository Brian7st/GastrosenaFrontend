import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-requisiciones-firmar',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './requisiciones-firmar.component.html',
  styleUrl: './requisiciones-firmar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesFirmarComponent {
  private router = inject(Router);

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
