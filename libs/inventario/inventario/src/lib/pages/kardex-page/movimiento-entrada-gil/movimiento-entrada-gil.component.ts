import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-movimiento-entrada-gil',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-entrada-gil.component.html',
  styleUrls: ['./movimiento-entrada-gil.component.scss']
})
export class MovimientoEntradaGilComponent {
  
  constructor(private router: Router) {}

  closeModal() {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
