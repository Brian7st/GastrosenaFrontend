import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-exportar-reporte-modal',
    imports: [CommonModule, FormsModule, LucideIconComponent],
    templateUrl: './exportar-reporte-modal.component.html',
    styleUrl: './exportar-reporte-modal.component.scss'
})
export class ExportarReporteModalComponent {
  @Output() close = new EventEmitter<void>();

  programaSeleccionado: string = 'Todos los Programas';
  rubroSeleccionado: string = 'Todos los Rubros';
  instructorSeleccionado: string = 'Todos los Instructores';
  fechaDesde: string = '';
  fechaHasta: string = '';
  
  formatoSeleccionado: 'excel' | 'pdf' | null = null;

  cerrarModal() {
    this.close.emit();
  }

  seleccionarFormato(formato: 'excel' | 'pdf') {
    this.formatoSeleccionado = formato;
  }

  restablecer() {
    this.programaSeleccionado = 'Todos los Programas';
    this.rubroSeleccionado = 'Todos los Rubros';
    this.instructorSeleccionado = 'Todos los Instructores';
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.formatoSeleccionado = null;
  }

  descargar() {
    if (!this.formatoSeleccionado) return;
    
    console.log('Descargando reporte', {
      programa: this.programaSeleccionado,
      rubro: this.rubroSeleccionado,
      instructor: this.instructorSeleccionado,
      desde: this.fechaDesde,
      hasta: this.fechaHasta,
      formato: this.formatoSeleccionado
    });
    
    this.close.emit();
  }
}
