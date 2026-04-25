import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-registrar-modal',
    imports: [CommonModule, FormsModule, LucideIconComponent],
    templateUrl: './registrar-modal.component.html',
    styleUrl: './registrar-modal.component.scss'
})
export class RegistrarModalComponent {
  @Output() close = new EventEmitter<void>();

  programaSeleccionado: string = '';
  nombreRubro: string = '';
  presupuestoInicial: number | null = null;
  
  cerrarModal() {
    this.close.emit();
  }

  guardar() {
    // Aquí iría la lógica del servicio para guardar el nuevo rubro
    console.log('Guardando rubro', {
      programa: this.programaSeleccionado,
      nombre: this.nombreRubro,
      inicial: this.presupuestoInicial
    });
    this.close.emit();
  }
}
