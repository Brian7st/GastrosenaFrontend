import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'restaurant-movimiento-export',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-export.component.html',
  styleUrl: './movimiento-export.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientoExportComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  exportForm: FormGroup = this.fb.group({
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required]
  });

  formatoSeleccionado = signal<'excel' | 'pdf' | 'csv'>('excel');
  tipoSeleccionado = signal<'entradas' | 'salidas' | 'ambos'>('ambos');

  setTipo(tipo: 'entradas' | 'salidas' | 'ambos'): void {
    this.tipoSeleccionado.set(tipo);
  }

  setFormato(formato: 'excel' | 'pdf' | 'csv'): void {
    this.formatoSeleccionado.set(formato);
  }

  onSubmit(): void {
    if (this.exportForm.valid) {
      // TODO: llamar a movimientosService.exportar(config)
      this.closeModal();
    }
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
