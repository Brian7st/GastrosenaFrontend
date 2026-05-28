import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'restaurant-confirmar-envio-solicitud-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmar-envio-solicitud-modal.component.html',
  styleUrls: ['./confirmar-envio-solicitud-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmarEnvioSolicitudModalComponent {
  @Input() isOpen = false;
  @Input() isEdit = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
