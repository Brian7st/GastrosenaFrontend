import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'restaurant-reversar-consolidado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reversar-consolidado-modal.component.html',
  styleUrl: './reversar-consolidado-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReversarConsolidadoModalComponent {
  @Input() consolidadoId = '';
  @Input() periodo = '';
  @Input() total = '';
  @Input() comprobantes = 0;
  
  // If true, shows the "Blocked" view. If false, shows the "Confirm" view.
  @Input() isBlocked = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  confirmKeyword = signal('');
  
  get isValid(): boolean {
    return this.confirmKeyword().trim().toUpperCase() === 'REVERSAR';
  }

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    if (!this.isBlocked && this.isValid) {
      this.confirm.emit();
    }
  }
}
