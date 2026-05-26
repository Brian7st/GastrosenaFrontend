import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FormatoExportacion {
  /** Clave única del formato, p. ej. 'excel' | 'pdf' | 'csv' */
  id: string;
  /** Etiqueta visible en la tarjeta */
  label: string;
  /** Descripción corta del formato */
  descripcion: string;
  /** Nombre del Material Symbol para el ícono principal */
  icono: string;
  /** Clase CSS de color para el ícono (usa tokens del design system) */
  iconoClase?: string;
  /** Opcional: pequeña etiqueta badge debajo de la descripción */
  etiqueta?: string;
}

export const FORMATOS_DEFAULT: FormatoExportacion[] = [
  {
    id: 'excel',
    label: 'Detallado Excel',
    descripcion:
      'Ideal para análisis profundo, tablas dinámicas y conciliación de partidas presupuestales.',
    icono: 'table_chart',
    iconoClase: 'icono--primary',
    etiqueta: 'Incluye retenciones ZESE',
  },
  {
    id: 'pdf',
    label: 'Resumen PDF',
    descripcion:
      'Documento formal listo para firma digital y presentación de informes ante contabilidad.',
    icono: 'picture_as_pdf',
    iconoClase: 'icono--danger',
  },
];

@Component({
  selector: 'inventario-exportar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exportar.component.html',
  styleUrl: './exportar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportarComponent {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  titulo    = input('Exportar Reporte');
  subtitulo = input('Seleccione el formato de salida deseado');
  formatos  = input<FormatoExportacion[]>(FORMATOS_DEFAULT);

  // ── Outputs ────────────────────────────────────────────────────────────────
  /** Emite el id del formato seleccionado al confirmar */
  exportar = output<string>();
  /** Emite al cerrar sin exportar */
  cerrar = output<void>();

  // ── Estado interno ─────────────────────────────────────────────────────────
  formatoSeleccionado = signal<string>('excel');

  onSeleccionar(id: string): void {
    this.formatoSeleccionado.set(id);
  }

  onExportar(): void {
    this.exportar.emit(this.formatoSeleccionado());
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}
