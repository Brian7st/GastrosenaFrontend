import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'inventario-back-button',
  standalone: true,
  template: `
    <button class="back-btn" type="button" (click)="clicked.emit()" aria-label="Volver">
      <span class="material-symbols-outlined">arrow_back</span>
    </button>
  `,
  styleUrl: './back-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  @Output() clicked = new EventEmitter<void>();
}
