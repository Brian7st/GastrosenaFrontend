import { Injectable } from '@angular/core';
import { Bien } from '../../models/inventario.model';

@Injectable({
  providedIn: 'root'
})
export class BienExportService {
  /**
   * Exporta un listado de bienes a CSV.
   */
  exportToCsv(bienes: Bien[]): void {
    const headers = ['ID', 'Código SENA', 'Código Proveedor', 'Nombre', 'Categoría', 'Stock', 'Valor', 'Estado'];
    const rows = bienes.map(b => [
      b.id,
      b.codigoSena,
      b.codigoProveedor || '',
      b.nombre,
      b.categoria,
      b.stockActual,
      b.valor,
      b.estado
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_bienes_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Simulación de exportación a PDF.
   */
  exportToPdf(bienes: Bien[]): void {
    console.log('Generando reporte PDF para', bienes.length, 'bienes...');
    alert('Funcionalidad de exportación a PDF se integrará con la librería jsPDF/pdfMake en la siguiente fase.');
  }
}
