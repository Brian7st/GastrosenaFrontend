import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'restaurant-exportar-consolidado-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exportar-consolidado-modal.component.html',
  styleUrl: './exportar-consolidado-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportarConsolidadoModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() export = new EventEmitter<'excel' | 'pdf'>();

  selectedFormat: 'excel' | 'pdf' = 'excel';

  onClose(): void {
    this.close.emit();
  }

  onExport(): void {
    this.export.emit(this.selectedFormat);
  }
}
