import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receta } from '../../models/receta.model';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'restaurant-detalle-receta',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './detalle-receta.component.html',
  styleUrl: './detalle-receta.component.scss'
})
export class DetalleRecetaComponent {
  protected readonly i18n = inject(I18nService);
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
