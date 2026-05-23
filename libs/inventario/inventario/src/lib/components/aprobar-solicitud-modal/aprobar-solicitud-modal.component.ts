import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'restaurant-aprobar-solicitud-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aprobar-solicitud-modal.component.html',
  styleUrls: ['./aprobar-solicitud-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AprobarSolicitudModalComponent {
  @Input() isOpen = false;
  @Input() solicitud: any = null;

  @Output() confirm = new EventEmitter<number>();
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
