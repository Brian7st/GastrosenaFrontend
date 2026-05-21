import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';

@Component({
  selector: 'restaurant-presupuesto-cargar-gil',
  standalone: true,
  imports: [CommonModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-cargar-gil.component.html',
  styleUrl: './presupuesto-cargar-gil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoCargarGilComponent {
  private router = inject(Router);
  private facade = inject(PresupuestoFacade);

  loading = this.facade.loading;

  onCargar(): void {
    // Pendiente: selección de solicitudes GIL (lista en construcción — Fase 4)
    this.closePanel();
  }

  closePanel(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
