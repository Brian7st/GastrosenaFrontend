import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { BienImportRow } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bien-import',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './bien-import.component.html',
  styleUrl: './bien-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienImportModalComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() import = new EventEmitter<BienImportRow[]>();

  isDragging = signal(false);
  file = signal<File | null>(null);
  previewData = signal<BienImportRow[]>([]);
  isValid = signal(false);

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  private processFile(file: File): void {
    this.file.set(file);
    // Simulación de procesamiento de CSV/Excel
    setTimeout(() => {
      const mockData: BienImportRow[] = [
        { codigoPlaca: 'SENA-001', descripcion: 'Silla Ergonómica', serial: 'XYZ-123', ubicacion: 'Oficina 101', estado: 'Activo' },
        { codigoPlaca: 'SENA-002', descripcion: 'Monitor 24"', serial: 'MON-445', ubicacion: 'Sala 2', estado: 'Activo' },
        { codigoPlaca: 'ERR-003', descripcion: '', serial: '???', ubicacion: 'Desconocida', estado: 'Inactivo', error: 'Falta descripción obligatoria' }
      ];
      this.previewData.set(mockData);
      this.isValid.set(mockData.every(row => !row.error));
    }, 1000);
  }

  onImport(): void {
    if (this.isValid()) {
      this.import.emit(this.previewData());
    }
  }
}
