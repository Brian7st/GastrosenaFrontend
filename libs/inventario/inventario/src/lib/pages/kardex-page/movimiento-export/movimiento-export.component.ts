import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'restaurant-movimiento-export',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-export.component.html',
  styleUrls: ['./movimiento-export.component.scss']
})
export class MovimientoExportComponent {
  exportForm: FormGroup;
  formatoSeleccionado: 'excel' | 'pdf' | 'csv' = 'excel';
  tipoSeleccionado: 'entradas' | 'salidas' | 'ambos' = 'ambos';

  constructor(private fb: FormBuilder, private router: Router) {
    this.exportForm = this.fb.group({
      fechaInicio: ['2023-10-01', Validators.required],
      fechaFin: ['2023-10-31', Validators.required]
    });
  }

  setTipo(tipo: 'entradas' | 'salidas' | 'ambos') {
    this.tipoSeleccionado = tipo;
  }

  setFormato(formato: 'excel' | 'pdf' | 'csv') {
    this.formatoSeleccionado = formato;
  }

  onSubmit() {
    if (this.exportForm.valid) {
      console.log('Exportando reporte...', {
        ...this.exportForm.value,
        tipo: this.tipoSeleccionado,
        formato: this.formatoSeleccionado
      });
      this.closeModal();
    }
  }

  closeModal() {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
