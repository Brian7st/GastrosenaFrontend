import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

export type ImportStatus = 'idle' | 'loading' | 'success' | 'error' | 'warning';

@Component({
  selector: 'restaurant-factura-import',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './factura-import.component.html',
  styleUrl: './factura-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaImportPageComponent {
  private router = inject(Router);

  fileLoaded   = signal(false);
  isDragOver   = signal(false);
  importStatus = signal<ImportStatus>('idle');
  fileName     = signal<string>('');

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File): void {
    this.fileName.set(file.name);
    this.importStatus.set('loading');
    this.validateFile(file);
  }

  private validateFile(file: File): void {
    // TODO: reemplazar por llamada a FacturasService.importarXML(file)
    const isXml = file.name.toLowerCase().endsWith('.xml');
    const isValidSize = file.size <= 10 * 1024 * 1024;

    if (!isValidSize) {
      this.importStatus.set('error');
      return;
    }

    // XML → éxito directo; PDF → advertencia por falta de OC vinculada
    this.importStatus.set(isXml ? 'success' : 'warning');
    this.fileLoaded.set(true);
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }
}
