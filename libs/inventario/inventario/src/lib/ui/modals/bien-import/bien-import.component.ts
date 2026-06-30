import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienImportRow } from '../../../models/inventario.model';
import { I18nService } from '../../../i18n/i18n.service';

export type BienImportPayload =
  | { tipo: 'csv'; filas: BienImportRow[] }
  | { tipo: 'excel'; archivo: File };

@Component({
  selector: 'restaurant-bien-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bien-import.component.html',
  styleUrl: './bien-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienImportModalComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Output() importar = new EventEmitter<BienImportPayload>();

  protected readonly i18n = inject(I18nService);

  isDragging = signal(false);
  file = signal<File | null>(null);
  isExcel = signal(false);
  isProcessing = signal(false);
  previewData = signal<BienImportRow[]>([]);
  hasErrors = signal(false);
  statusMessage = signal<string | null>(null);

  readonly INSTRUCCIONES = computed(() => [
    this.i18n.t('bien-import.instruccion_1'),
    this.i18n.t('bien-import.instruccion_2'),
    this.i18n.t('bien-import.instruccion_3'),
    this.i18n.t('bien-import.instruccion_4'),
    this.i18n.t('bien-import.instruccion_5'),
  ]);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const f = input.files?.[0];
    if (f) void this.processFile(f);
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
    if (f) void this.processFile(f);
  }

  removeFile(): void {
    this.file.set(null);
    this.isExcel.set(false);
    this.previewData.set([]);
    this.hasErrors.set(false);
    this.statusMessage.set(null);
  }

  getFileSize(): string {
    const f = this.file();
    if (!f) return '';
    if (f.size < 1024) return `${f.size} B`;
    if (f.size < 1024 * 1024) return `${(f.size / 1024).toFixed(1)} KB`;
    return `${(f.size / (1024 * 1024)).toFixed(1)} MB`;
  }

  getValidacionClass(v?: string): string {
    if (!v || v === this.i18n.t('bien-import.valid_correcto')) return 'valid--ok';
    return 'valid--error';
  }

  onProcesar(): void {
    const archivo = this.file();
    if (!archivo) return;

    const fileName = archivo.name.toLowerCase();
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      this.importar.emit({ tipo: 'excel', archivo });
      return;
    }

    const validos = this.previewData().filter(r => !r.error);
    this.importar.emit({ tipo: 'csv', filas: validos });
  }

  onDescargarPlantilla(): void {
    const headers = [
      'codigoSena',
      'descripcion',
      'categoria',
      'vrlAdjudicado',
      'vrlAntes',
      'iva',
      'codigoProveedor',
      'unidadMedida',
    ];
    const sampleRow = [
      'SENA-002',                      // codigoSena
      'Tomate fresco de ensalada',     // descripcion
      'Alimentos',                     // categoria
      '4200.00',                       // vrlAdjudicado
      '3800.00',                       // vrlAntes
      '0.00',                          // iva (Exento en Colombia)
      'PROV-002',                      // codigoProveedor
      'Kilogramo',                     // unidadMedida
    ];

    const csvLines = [
      'sep=;',
      headers.map(value => this.escapeCsvValue(value)).join(';'),
      sampleRow.map(value => this.escapeCsvValue(value)).join(';'),
    ];

    const csv = `\uFEFF${csvLines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_importacion_bienes.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private async processFile(f: File): Promise<void> {
    this.file.set(f);
    this.isProcessing.set(true);
    this.previewData.set([]);
    this.hasErrors.set(false);
    this.statusMessage.set(null);

    const fileName = f.name.toLowerCase();
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      this.isExcel.set(true);
      this.isProcessing.set(false);
      return;
    }

    if (!fileName.endsWith('.csv')) {
      this.statusMessage.set(this.i18n.t('bien-import.msg_formato_no_soportado'));
      this.isProcessing.set(false);
      return;
    }

    try {
      const text = await f.text();
      const rows = this.parseCsv(text);
      this.previewData.set(rows);
      this.hasErrors.set(rows.some(row => !!row.error));
      this.statusMessage.set(rows.length ? null : this.i18n.t('bien-import.msg_sin_filas'));
    } catch {
      this.statusMessage.set(this.i18n.t('bien-import.msg_error_lectura'));
    } finally {
      this.isProcessing.set(false);
    }
  }

  private parseCsv(text: string): BienImportRow[] {
    const normalized = text.replace(/^\uFEFF/, '').replace(/\r/g, '');
    const lines = normalized
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .filter(line => !line.toLowerCase().startsWith('sep='));

    if (lines.length < 2) return [];

    const separator = lines[0].includes(';') ? ';' : ',';
    const headers = this.parseCsvLine(lines[0], separator).map(value => value.trim());
    const seenCodes = new Set<string>();

    return lines.slice(1).map((line) => {
      const values = this.parseCsvLine(line, separator);
      const record = headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = (values[index] ?? '').trim();
        return acc;
      }, {});

      const row: BienImportRow = {
        codigoSena: record['codigoSena'] || undefined,
        descripcion: record['descripcion'] || undefined,
        categoria: record['categoria'] || undefined,
        unidadMedida: record['unidadMedida'] || '',
        codigoProveedor: record['codigoProveedor'] || undefined,
        vrlAdjudicado: record['vrlAdjudicado'] !== undefined ? Number(record['vrlAdjudicado']) : 0,
        vrlAntes: record['vrlAntes'] !== undefined ? Number(record['vrlAntes']) : 0,
        iva: record['iva'] !== undefined ? Number(record['iva']) : 0,
        stockMinimo: record['stockMinimo'] !== undefined ? Number(record['stockMinimo']) : undefined,
        validacion: this.i18n.t('bien-import.valid_correcto'),
      };

      if (!row.unidadMedida) {
        row.validacion = this.i18n.t('bien-import.valid_falta_campo');
        row.error = this.i18n.t('bien-import.valid_um_obligatoria');
      } else if (row.codigoSena && seenCodes.has(row.codigoSena)) {
        row.validacion = this.i18n.t('bien-import.valid_codigo_duplicado');
        row.error = this.i18n.t('bien-import.valid_codigo_duplicado_msg');
      }

      if (row.codigoSena) seenCodes.add(row.codigoSena);
      return row;
    });
  }

  private parseCsvLine(line: string, separator: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === separator && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  private escapeCsvValue(value: string): string {
    return `"${value.replaceAll('"', '""')}"`;
  }
}
