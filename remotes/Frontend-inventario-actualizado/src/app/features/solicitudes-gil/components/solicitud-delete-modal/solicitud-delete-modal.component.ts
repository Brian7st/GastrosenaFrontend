import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-solicitud-delete-modal',
    imports: [CommonModule, FormsModule, LucideIconComponent],
    templateUrl: './solicitud-delete-modal.component.html',
    styleUrls: ['./solicitud-delete-modal.component.scss']
})
export class SolicitudDeleteModalComponent {
  @Input() codigoSolicitud = '';
  @Output() cerrar = new EventEmitter<void>();

  confirmText = signal('');

  get isValid(): boolean {
    return this.confirmText().toUpperCase() === 'ELIMINAR';
  }

  close() {
    this.cerrar.emit();
  }

  confirmarEliminacion() {
    if (this.isValid) {
      console.log('Eliminando solicitud:', this.codigoSolicitud);
      this.close();
    }
  }
}
