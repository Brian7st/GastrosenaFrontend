import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'restaurant-confirm-dialog',
  standalone: true,
  imports: [NgIf],
  template: `
    <section class="confirm-dialog" *ngIf="open">
      <strong class="confirm-dialog__title">{{ title }}</strong>
      <p class="confirm-dialog__message">{{ message }}</p>
      <div class="confirm-dialog__actions">
        <button type="button" class="confirm-dialog__button" (click)="cancel.emit()">Cancelar</button>
        <button type="button" class="confirm-dialog__button confirm-dialog__button--danger" (click)="confirm.emit()">
          Confirmar
        </button>
      </div>
    </section>
  `,
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Seguro que querés continuar?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
