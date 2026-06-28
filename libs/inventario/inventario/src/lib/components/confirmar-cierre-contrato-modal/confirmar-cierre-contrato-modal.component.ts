import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Modal de confirmación para cerrar un contrato.
 * Advierte al usuario que todos los bienes asociados al contrato serán desactivados.
 */
@Component({
  selector: 'restaurant-confirmar-cierre-contrato-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmar-cierre-contrato-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmarCierreContratoModalComponent {
  @Input() isOpen = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
