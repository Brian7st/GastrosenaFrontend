import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-reverse-modal',
    imports: [CommonModule, FormsModule, LucideIconComponent],
    templateUrl: './reverse-modal.component.html',
    styleUrls: ['./reverse-modal.component.scss']
})
export class ReverseModalComponent {
  @Output() close = new EventEmitter<void>();

  confirmText = signal('');

  get isConfirmed(): boolean {
    return this.confirmText() === 'ANULAR';
  }

  closeModal() {
    this.close.emit();
  }

  confirmReverse() {
    if (this.isConfirmed) {
      // lógica para reversar
      this.closeModal();
    }
  }
}
