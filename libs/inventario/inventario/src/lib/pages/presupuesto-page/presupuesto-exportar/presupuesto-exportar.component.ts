import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-presupuesto-exportar',
  standalone: true,
  imports: [LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-exportar.component.html',
  styleUrl: './presupuesto-exportar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoExportarComponent {
  private router = inject(Router);
  protected readonly i18n = inject(I18nService);
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
