import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'restaurant-confirm-dialog',
  standalone: true,
  imports: [NgIf, ButtonComponent],
  template: `
    <div class="confirm-dialog__backdrop" *ngIf="open" (click)="cancel.emit()">
      <section class="confirm-dialog" (click)="$event.stopPropagation()">
        <strong class="confirm-dialog__title">{{ title }}</strong>
        <p class="confirm-dialog__message">{{ message }}</p>
        <div class="confirm-dialog__actions">
          <restaurant-button variant="ghost" (click)="cancel.emit()" *ngIf="showCancel">{{ cancelText }}</restaurant-button>
          <restaurant-button variant="primary" (click)="confirm.emit()">{{ confirmText }}</restaurant-button>
        </div>
      </section>
    </div>
  `,
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Seguro que querés continuar?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() showCancel = true;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
