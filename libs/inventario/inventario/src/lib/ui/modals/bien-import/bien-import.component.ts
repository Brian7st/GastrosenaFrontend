import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienImportRow } from '../../../models/inventario.model';

@Component({
  selector: 'restaurant-bien-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bien-import.component.html',
  styleUrl: './bien-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienImportModalComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() import = new EventEmitter<BienImportRow[]>();

  isDragging = signal(false);
  file = signal<File | null>(null);
  isProcessing = signal(false);
  previewData = signal<BienImportRow[]>([]);
  hasErrors = signal(false);

  readonly INSTRUCCIONES = [
    'Asegúrese de usar los encabezados definidos en la plantilla institucional.',
    'Los campos marcados con asterisco (*) son obligatorios para el registro oficial.',
    'Revise la vista previa antes de procesar para evitar duplicidades de seriales.',
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const f = input.files?.[0];
    if (f) this.processFile(f);
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
    const f = event.dataTransfer?.files[0];
    if (f) this.processFile(f);
  }

  private processFile(f: File): void {
    this.file.set(f);
    this.isProcessing.set(true);
    this.previewData.set([]);

    setTimeout(() => {
      const mock: BienImportRow[] = [
        { codigoPlaca: 'SENA-001245', descripcion: 'Computador Portátil HP EliteBook', serial: '5CG12345XYZ', ubicacion: 'Sede Central - Piso 3', estado: 'Activo', um: 'Und', validacion: 'Correcto' },
        { codigoPlaca: 'SENA-001246', descripcion: 'Monitor Dell UltraSharp 27"', serial: 'CN-0X123-456', ubicacion: 'Sede Central - Piso 3', estado: 'Activo', um: 'Und', validacion: 'Código duplicado', error: 'Código duplicado' },
        { codigoPlaca: 'SENA-001247', descripcion: 'Silla Ergonómica Pro-Manager', serial: 'N/A', ubicacion: 'Biblioteca - Ala Norte', estado: 'Bajo Stock', um: 'Und', validacion: 'Correcto' },
        { codigoPlaca: 'SENA-001248', descripcion: 'Video Beam Epson PowerLite', serial: 'VBP-7788-990', ubicacion: 'Auditorio Principal', estado: 'Activo', um: 'Und', validacion: 'Correcto' },
        { codigoPlaca: 'SENA-001249', descripcion: 'Tableta Digitalizadora Wacom', serial: 'WCM-4455-667', ubicacion: 'Lab Diseño Gráfico', estado: 'Activo', um: 'Und', validacion: 'Correcto' },
      ];
      this.previewData.set(mock);
      this.hasErrors.set(mock.some(r => !!r.error));
      this.isProcessing.set(false);
    }, 1000);
  }

  removeFile(): void {
    this.file.set(null);
    this.previewData.set([]);
    this.hasErrors.set(false);
  }

  getFileSize(): string {
    const f = this.file();
    if (!f) return '';
    if (f.size < 1024) return `${f.size} B`;
    if (f.size < 1024 * 1024) return `${(f.size / 1024).toFixed(1)} KB`;
    return `${(f.size / (1024 * 1024)).toFixed(1)} MB`;
  }

  getValidacionClass(v?: string): string {
    if (!v || v === 'Correcto') return 'valid--ok';
    return 'valid--error';
  }

  onProcesar(): void {
    const validos = this.previewData().filter(r => !r.error);
    this.import.emit(validos);
  }

  onDescargarPlantilla(): void {
    const csv = 'codigoPlaca,descripcion,serial,ubicacion,estado,um\nSENA-XXXXX,Nombre del Bien,SERIAL-001,Ubicación,Activo,Und\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_importacion_bienes.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
