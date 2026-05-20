import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'restaurant-movimiento-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, ButtonComponent, BackButtonComponent],
  templateUrl: './movimiento-detail.component.html',
  styleUrl: './movimiento-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientoDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/app/inventario/movimientos']);
      return;
    }
    // TODO: llamar a kardexFacade.cargarMovimiento(id)
  }

  goBack() {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
