import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-movimiento-entrada-gil',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-entrada-gil.component.html',
  styleUrl: './movimiento-entrada-gil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientoEntradaGilComponent {
  private router = inject(Router);

  closeModal() {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
