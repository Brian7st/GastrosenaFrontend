import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-factura-form-modal',
    imports: [CommonModule, LucideIconComponent],
    templateUrl: './factura-form-modal.component.html',
    styleUrls: ['./factura-form-modal.component.scss']
})
export class FacturaFormModalComponent {
  @Output() cerrar = new EventEmitter<void>();

  close() {
    this.cerrar.emit();
  }
}
