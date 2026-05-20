import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-requisiciones-despacho',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './requisiciones-despacho.component.html',
  styleUrl: './requisiciones-despacho.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDespachoComponent {
  private router = inject(Router);

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
