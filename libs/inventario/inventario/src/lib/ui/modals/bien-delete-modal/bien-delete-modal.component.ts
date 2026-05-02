import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Input, Output, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bien } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bien-delete-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bien-delete-modal.component.html',
  styleUrl: './bien-delete-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienDeleteModalComponent {
  @Input({ required: true }) bien!: Bien;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  keyword = signal('');

  /** Si el bien tiene stock activo, el modo es "bloqueado" */
  isBloqueado = computed(() => this.bien?.stockActual > 0);

  /** Solo habilitar el botón Eliminar cuando se escribe ELIMINAR (modo libre) */
  canDelete = computed(() =>
    !this.isBloqueado() && this.keyword().trim().toUpperCase() === 'ELIMINAR'
  );

  onKeywordChange(val: string): void {
    this.keyword.set(val);
  }

  onConfirm(): void {
    if (this.canDelete()) {
      this.confirm.emit();
    }
  }
}
