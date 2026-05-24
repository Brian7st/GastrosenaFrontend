import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ExportarComponent, FormatoExportacion } from '../../../../components/exportar/exportar.component';

const FORMATOS_CONSOLIDADO: FormatoExportacion[] = [
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
    label: 'Resumen PDF Contable',
    descripcion:
      'Documento formal listo para firma digital y presentación de informes mensuales ante contabilidad.',
    icono: 'picture_as_pdf',
    iconoClase: 'icono--danger',
  },
];

@Component({
  selector: 'restaurant-exportar-consolidado-modal',
  standalone: true,
  imports: [ExportarComponent],
  template: `
    <inventario-exportar
      titulo="Exportar Reporte para Contabilidad"
      subtitulo="Seleccione el formato de salida deseado para este consolidado"
      [formatos]="formatos"
      (exportar)="export.emit($event)"
      (cerrar)="close.emit()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportarConsolidadoModalComponent {
  @Output() close   = new EventEmitter<void>();
  @Output() export  = new EventEmitter<string>();

  readonly formatos = FORMATOS_CONSOLIDADO;
}
