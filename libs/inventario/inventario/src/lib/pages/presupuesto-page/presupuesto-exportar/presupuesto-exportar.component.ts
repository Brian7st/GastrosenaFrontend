import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'inventario-presupuesto-exportar',
  standalone: true,
  imports: [CommonModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-exportar.component.html',
  styleUrls: ['./presupuesto-exportar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoExportarComponent {
  private router = inject(Router);

  formatoSeleccionado: 'excel' | 'pdf' = 'excel';

  setFormato(formato: 'excel' | 'pdf'): void {
    this.formatoSeleccionado = formato;
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
