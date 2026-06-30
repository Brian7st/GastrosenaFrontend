import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-movimiento-export',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-export.component.html',
  styleUrl: './movimiento-export.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientoExportComponent {
  private fb = inject(FormBuilder);
  protected readonly i18n = inject(I18nService);
  private router = inject(Router);
  private facade = inject(KardexFacade);

  exportForm: FormGroup = this.fb.group({
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required]
  });

  formatoSeleccionado = signal<'excel' | 'pdf'>('excel');
  tipoSeleccionado = signal<'entradas' | 'salidas' | 'ambos'>('ambos');

  setTipo(tipo: 'entradas' | 'salidas' | 'ambos'): void {
    this.tipoSeleccionado.set(tipo);
  }

  setFormato(formato: 'excel' | 'pdf'): void {
    this.formatoSeleccionado.set(formato);
  }

  onSubmit(): void {
    if (this.exportForm.valid) {
      const { fechaInicio, fechaFin } = this.exportForm.value;
      const sel = this.tipoSeleccionado();
      const tipo = sel === 'entradas' ? 'ENTRADA' : sel === 'salidas' ? 'SALIDA' : undefined;
      this.facade.exportarUsoBienes(fechaInicio, fechaFin, this.formatoSeleccionado(), tipo);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
