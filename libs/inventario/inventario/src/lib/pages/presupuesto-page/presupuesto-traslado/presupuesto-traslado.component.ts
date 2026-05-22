import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';

@Component({
  selector: 'restaurant-presupuesto-traslado',
  standalone: true,
  imports: [CommonModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-traslado.component.html',
  styleUrl: './presupuesto-traslado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoTrasladoComponent {
  private router = inject(Router);
  private facade = inject(PresupuestoFacade);

  loading = this.facade.loading;

  onSubmit(): void {
    // Pendiente: datos del formulario de traslado (form en construcción — Fase 4)
    this.closeModal();
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
