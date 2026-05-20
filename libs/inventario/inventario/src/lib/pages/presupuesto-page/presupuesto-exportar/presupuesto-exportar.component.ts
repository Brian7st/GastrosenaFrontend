import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-presupuesto-exportar',
  standalone: true,
  imports: [CommonModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-exportar.component.html',
  styleUrl: './presupuesto-exportar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoExportarComponent {
  private router = inject(Router);

  formatoSeleccionado = signal<'excel' | 'pdf'>('excel');

  setFormato(formato: 'excel' | 'pdf'): void {
    this.formatoSeleccionado.set(formato);
  }

  onExportar(): void {
    // TODO: llamar a presupuestoFacade.exportar(this.formatoSeleccionado())
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
