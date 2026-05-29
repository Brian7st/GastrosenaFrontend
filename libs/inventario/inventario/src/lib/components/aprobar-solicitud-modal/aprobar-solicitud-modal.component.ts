import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SolicitudSesion } from '../../models/solicitud-sesion.model';

@Component({
  selector: 'restaurant-aprobar-solicitud-modal',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './aprobar-solicitud-modal.component.html',
  styleUrls: ['./aprobar-solicitud-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AprobarSolicitudModalComponent {
  @Input() isOpen = false;
  @Input() solicitud: SolicitudSesion | null = null;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() confirm = new EventEmitter<string>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    if (this.solicitud) {
      this.confirm.emit(this.solicitud.id);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
