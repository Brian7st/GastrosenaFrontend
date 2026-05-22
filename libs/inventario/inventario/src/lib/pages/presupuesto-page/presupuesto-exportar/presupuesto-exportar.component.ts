import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';

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
  private facade = inject(PresupuestoFacade);

  loading             = this.facade.loading;
  formatoSeleccionado = signal<'excel' | 'pdf'>('excel');

  setFormato(formato: 'excel' | 'pdf'): void {
    this.formatoSeleccionado.set(formato);
  }

  onExportar(): void {
    this.facade.exportar(this.formatoSeleccionado());
    this.closeModal();
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
