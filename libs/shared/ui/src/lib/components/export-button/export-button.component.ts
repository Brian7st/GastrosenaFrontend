import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'restaurant-export-button',
  standalone: true,
  template: `
    <button type="button" class="export-button" (click)="exportClick.emit()">
      {{ label }}
    </button>
  `,
  styleUrl: './export-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportButtonComponent {
  @Input() label = 'Exportar';
  @Output() exportClick = new EventEmitter<void>();
}
