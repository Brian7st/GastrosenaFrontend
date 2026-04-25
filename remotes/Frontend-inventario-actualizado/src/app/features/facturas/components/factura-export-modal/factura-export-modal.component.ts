import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-factura-export-modal',
    imports: [CommonModule, LucideIconComponent, FormsModule],
    templateUrl: './factura-export-modal.component.html',
    styleUrls: ['./factura-export-modal.component.scss']
})
export class FacturaExportModalComponent {
  @Output() cerrar = new EventEmitter<void>();

  close() {
    this.cerrar.emit();
  }
}
