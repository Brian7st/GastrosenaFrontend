import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { KardexFacade } from '../../../data-access/kardex.facade';

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
  private route  = inject(ActivatedRoute);
  private facade = inject(KardexFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  movimiento = this.facade.movimientoSeleccionado;
  loading    = this.facade.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarMovimiento(id);
    } else {
      this.router.navigate(['/app/inventario/movimientos']);
    }
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
