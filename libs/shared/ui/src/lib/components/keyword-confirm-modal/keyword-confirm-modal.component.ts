import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'restaurant-keyword-confirm-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  templateUrl: './keyword-confirm-modal.component.html',
  styleUrl: './keyword-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeywordConfirmModalComponent {
  @Input() open = false;
  @Input() title = '¿Estás seguro de continuar?';
  @Input() description = 'Esta acción no se puede deshacer.';
  @Input() keyword = 'ELIMINAR';
  @Input() keywordLabel = 'Escribe la palabra de confirmación para continuar';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() identifierLabel?: string;
  @Input() identifierValue?: string;
  @Input() accent: 'danger' | 'warning' = 'danger';

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  protected readonly confirmText = signal('');
  protected readonly normalizedKeyword = computed(() => this.keyword.trim().toUpperCase());
  protected readonly isValid = computed(
    () => this.confirmText().trim().toUpperCase() === this.normalizedKeyword(),
  );

  protected onConfirm(): void {
    if (this.isValid()) {
      this.confirm.emit();
    }
  }

  protected onCancel(): void {
    this.confirmText.set('');
    this.cancel.emit();
  }
}
