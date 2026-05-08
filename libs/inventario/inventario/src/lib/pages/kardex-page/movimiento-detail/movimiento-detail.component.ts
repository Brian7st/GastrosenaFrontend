import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-movimiento-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-detail.component.html',
  styleUrls: ['./movimiento-detail.component.scss']
})
export class MovimientoDetailComponent {
  
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
