import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receta } from '../../models/receta.model';
import { LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-detalle-receta',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './detalle-receta.component.html',
  styleUrl: './detalle-receta.component.scss'
})
export class DetalleRecetaComponent {
  @Input({ required: true }) receta!: Receta;
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }

  cerrarModal(event: MouseEvent) {
    // Si se hace clic en el fondo gris, se cierra el modal
    this.cerrar();
  }
}
