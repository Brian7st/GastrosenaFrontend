import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratoImportRow, RegistrarContratoData } from '../../../models/contrato.model';

@Component({
  selector: 'restaurant-contrato-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contrato-import.component.html',
  styleUrl: './contrato-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContratoImportModalComponent {
  @Output() cancelar = new EventEmitter<void>();
  @Output() importar = new EventEmitter<RegistrarContratoData>();

  // ── Cabecera del contrato ──────────────────────────────────────────────────
  numero       = signal<string>('');
  descripcion  = signal<string>('');
  vigencia     = signal<number>(new Date().getFullYear());
  fechaInicio  = signal<string>('');
  fechaFin     = signal<string>('');

  // ── Archivo de ítems (cols B-K) ────────────────────────────────────────────
  isDragging    = signal(false);
  file          = signal<File | null>(null);
  isProcessing  = signal(false);
  previewData   = signal<ContratoImportRow[]>([]);
  hasErrors     = signal(false);
  statusMessage = signal<string | null>(null);

  readonly INSTRUCCIONES = [
    'Complete el número y la vigencia del contrato; descargue la plantilla y cargue los ítems.',
    'Ref. Artículo, Descripción y Vlr. Adjudicado son obligatorios por ítem. El código SENA es opcional.',
    'Si algún ítem tiene errores, se rechaza el lote completo. Corrija antes de importar.',
    'Al importar se crean o actualizan los bienes del catálogo cruzando por descripción.',
  ];

  /** La cabecera es válida cuando hay número y un año de vigencia positivo. */
  readonly cabeceraValida = computed(() => this.numero().trim().length > 0 && this.vigencia() > 0);

  readonly importDeshabilitado = computed(() =>
    !this.cabeceraValida() ||
    !this.file() ||
    this.isProcessing() ||
    this.previewData().length === 0 ||
    this.hasErrors(),
  );

  onNumero(value: string): void { this.numero.set(value); }
  onDescripcion(value: string): void { this.descripcion.set(value); }
  onVigencia(value: string): void { this.vigencia.set(Number(value) || 0); }
  onFechaInicio(value: string): void { this.fechaInicio.set(value); }
  onFechaFin(value: string): void { this.fechaFin.set(value); }

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
    if (!v || v === 'Correcto') return 'valid--ok';
    return 'valid--error';
  }

  onProcesar(): void {
    if (this.importDeshabilitado()) return;

    const validos = this.previewData().filter(r => !r.error);
    const data: RegistrarContratoData = {
      numero: this.numero().trim(),
      descripcion: this.descripcion().trim() || null,
      vigencia: this.vigencia(),
      fechaInicio: this.fechaInicio() || null,
      fechaFin: this.fechaFin() || null,
      items: validos.map(r => ({
        refArticulo: r.refArticulo,
        codigoSena: r.codigoSena,
        descripcion: r.descripcion,
        unidadMedida: r.unidadMedida,
        cantidad: r.cantidad,
        codigoProveedor: r.codigoProveedor,
        valorEstimado: r.valorEstimado,
        vrlAdjudicado: r.vrlAdjudicado,
        vrlAntes: r.vrlAntes,
        ivaPorcentaje: r.ivaPorcentaje,
      })),
    };
    this.importar.emit(data);
  }

  onDescargarPlantilla(): void {
    const headers = [
      'refArticulo',
      'codigoSena',
      'descripcion',
      'unidadMedida',
      'cantidad',
      'codigoProveedor',
      'valorEstimado',
      'vrlAdjudicado',
      'vrlAntes',
      'ivaPorcentaje',
    ];
    const sampleRow = [
      '1',                          // refArticulo
      '',                           // codigoSena (opcional — no viene en el contrato)
      'Harina de trigo',            // descripcion
      'Kilogramo',                  // unidadMedida
      '100',                        // cantidad
      'PROV-900',                   // codigoProveedor
      '5200.00',                    // valorEstimado
      '5000.00',                    // vrlAdjudicado
      '4202.00',                    // vrlAntes
      '0.19',                       // ivaPorcentaje (0, 0.05 o 0.19)
    ];

    const csvLines = [
      'sep=;',
      headers.map(value => this.escapeCsvValue(value)).join(';'),
      sampleRow.map(value => this.escapeCsvValue(value)).join(';'),
    ];

    const csv = `﻿${csvLines.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_importacion_contrato.csv';
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
    if (!fileName.endsWith('.csv')) {
      this.statusMessage.set('Formato no soportado. Suba un archivo CSV generado desde la plantilla.');
      this.isProcessing.set(false);
      return;
    }

    try {
      const text = await f.text();
      const rows = this.parseCsv(text);
      this.previewData.set(rows);
      this.hasErrors.set(rows.some(row => !!row.error));
      this.statusMessage.set(rows.length ? null : 'El archivo no contiene ítems válidos para importar.');
    } catch {
      this.statusMessage.set('No se pudo leer el archivo CSV. Verifique la plantilla y vuelva a intentarlo.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  private parseCsv(text: string): ContratoImportRow[] {
    const normalized = text.replace(/^﻿/, '').replace(/\r/g, '');
    const lines = normalized
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .filter(line => !line.toLowerCase().startsWith('sep='));

    if (lines.length < 2) return [];

    const separator = lines[0].includes(';') ? ';' : ',';
    const headers = this.parseCsvLine(lines[0], separator).map(value => value.trim());
    const seenRefs = new Set<string>();

    return lines.slice(1).map((line) => {
      const values = this.parseCsvLine(line, separator);
      const record = headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = (values[index] ?? '').trim();
        return acc;
      }, {});

      const row: ContratoImportRow = {
        refArticulo: record['refArticulo'] || '',
        codigoSena: record['codigoSena'] || null,
        descripcion: record['descripcion'] || '',
        unidadMedida: record['unidadMedida'] || null,
        cantidad: this.toNullableNumber(record['cantidad']),
        codigoProveedor: record['codigoProveedor'] || null,
        valorEstimado: this.toNullableNumber(record['valorEstimado']),
        vrlAdjudicado: Number(record['vrlAdjudicado'] ?? ''),
        vrlAntes: this.toNullableNumber(record['vrlAntes']),
        ivaPorcentaje: this.toNullableNumber(record['ivaPorcentaje']),
        validacion: 'Correcto',
      };

      if (!row.refArticulo) {
        row.validacion = 'Falta campo';
        row.error = 'La referencia de artículo es obligatoria';
      } else if (!row.descripcion) {
        row.validacion = 'Falta campo';
        row.error = 'La descripción es obligatoria';
      } else if (!Number.isFinite(row.vrlAdjudicado) || row.vrlAdjudicado < 0) {
        row.validacion = 'Valor inválido';
        row.error = 'El valor adjudicado debe ser un número no negativo';
      } else if (seenRefs.has(row.refArticulo)) {
        row.validacion = 'Ref. duplicada';
        row.error = 'Referencia de artículo duplicada en el archivo';
      }

      if (row.refArticulo) seenRefs.add(row.refArticulo);
      return row;
    });
  }

  private toNullableNumber(value: string | undefined): number | null {
    if (value === undefined || value.trim() === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
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
