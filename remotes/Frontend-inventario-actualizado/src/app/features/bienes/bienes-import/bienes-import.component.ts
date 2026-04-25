import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { ImportRow, IMPORT_ROWS_MOCK } from '../models/bien.model';

@Component({
    selector: 'app-bienes-import',
    imports: [CommonModule, RouterModule, LucideIconComponent],
    templateUrl: './bienes-import.component.html',
    styleUrls: ['./bienes-import.component.scss']
})
export class BienesImportComponent {
  fileSelected = signal(false);
  fileName = signal('');
  previewRows = signal<ImportRow[]>(IMPORT_ROWS_MOCK);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.simulateFileLoad();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName.set(input.files[0].name);
      this.simulateFileLoad();
    }
  }

  private simulateFileLoad(): void {
    this.fileSelected.set(true);
    this.fileName.set('inventario_bienes_2024.xlsx');
  }

  procesar(): void {
    console.log('Procesando importación:', this.previewRows());
  }
}
