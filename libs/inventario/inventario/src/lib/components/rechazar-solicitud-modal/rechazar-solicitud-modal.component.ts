import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolicitudSesion } from '../../models/solicitud-sesion.model';

@Component({
  selector: 'restaurant-rechazar-solicitud-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rechazar-solicitud-modal.component.html',
  styleUrls: ['./rechazar-solicitud-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechazarSolicitudModalComponent {
  @Input() isOpen = false;
  @Input() solicitud: SolicitudSesion | null = null;

  /** Emite el motivo del rechazo (no vacío). */
  @Output() confirmar = new EventEmitter<string>();
  @Output() cancelar = new EventEmitter<void>();

  motivo = signal<string>('');

  onConfirm(): void {
    const m = this.motivo().trim();
    if (!m) return;
    this.confirmar.emit(m);
    this.motivo.set('');
  }

  onCancel(): void {
    this.motivo.set('');
    this.cancelar.emit();
  }
}
