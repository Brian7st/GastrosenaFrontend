import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-export-modal',
    imports: [CommonModule, LucideIconComponent],
    templateUrl: './export-modal.component.html',
    styleUrls: ['./export-modal.component.scss']
})
export class ExportModalComponent {
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
