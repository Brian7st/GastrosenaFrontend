import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-requisiciones-resumen',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
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
