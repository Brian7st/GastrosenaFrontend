import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'inventario-presupuesto-cargar-gil',
  standalone: true,
  imports: [CommonModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-cargar-gil.component.html',
  styleUrls: ['./presupuesto-cargar-gil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoCargarGilComponent {
  private router = inject(Router);

  closePanel(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
