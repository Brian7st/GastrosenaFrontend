import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

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

  closeModal(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
