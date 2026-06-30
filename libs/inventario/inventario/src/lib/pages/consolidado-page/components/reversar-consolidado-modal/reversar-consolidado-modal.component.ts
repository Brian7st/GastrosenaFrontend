import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-reversar-consolidado-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reversar-consolidado-modal.component.html',
  styleUrl: './reversar-consolidado-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReversarConsolidadoModalComponent {
  protected readonly i18n = inject(I18nService);
  @Input() consolidadoId = '';
  @Input() periodo = '';
  @Input() total = '';
  @Input() comprobantes = 0;
  
  // If true, shows the "Blocked" view. If false, shows the "Confirm" view.
  @Input() isBlocked = false;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<void>();
  // eslint-disable-next-line @angular-eslint/no-output-native
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
