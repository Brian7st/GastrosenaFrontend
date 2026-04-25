import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-delete-confirm-modal',
    imports: [CommonModule, FormsModule, LucideIconComponent],
    templateUrl: './delete-confirm-modal.component.html',
    styleUrls: ['./delete-confirm-modal.component.scss']
})
export class DeleteConfirmModalComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();

  confirmText = '';
  isValid = signal(false);

  onInput(): void {
    this.isValid.set(this.confirmText.trim().toUpperCase() === 'ELIMINAR');
  }

  close(): void {
    this.cerrar.emit();
  }

  onConfirm(): void {
    if (this.isValid()) {
      this.confirmar.emit();
    }
  }
}
