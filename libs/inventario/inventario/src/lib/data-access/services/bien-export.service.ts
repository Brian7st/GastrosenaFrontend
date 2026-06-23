import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Bien } from '../../models/inventario.model';
import { descargarBlob } from '../../util';

@Injectable({
  providedIn: 'root'
})
export class BienExportService {
  /**
   * Exporta un listado de bienes a CSV.
   */
  exportToCsv(bienes: Bien[]): void {
    const headers = ['ID', 'Código SENA', 'Código Proveedor', 'Descripción', 'Categoría', 'Stock', 'Valor', 'Estado'];
    const rows = bienes.map(b => [
      b.id,
      b.codigoSena,
      b.codigoProveedor || '',
      b.descripcion,
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

  private http = inject(HttpClient);

  /**
   * Exporta el reporte de inventario a PDF/Excel vía ga-ms-reportes
   * (GET /api/reportes/inventario-general). El documento lo GENERA el servidor;
   * por eso no usa la lista filtrada en cliente.
   *
   * NOTA: el endpoint solo filtra por `categoriaId` (numérico) e `incluirAgotados`.
   * El front maneja categorías por NOMBRE (sin id), así que por ahora se pide el
   * reporte global. Para filtrar por categoría hace falta un catálogo con id desde
   * backend. El resto de filtros de pantalla (almacén, rango de fechas, bajo stock)
   * no existen en el endpoint y no se aplican.
   */
  exportToPdf(formato: 'pdf' | 'excel' = 'pdf', incluirAgotados = true): void {
    const fmt = formato.toLowerCase() === 'pdf' ? 'PDF' : 'EXCEL';
    const ext = formato.toLowerCase() === 'pdf' ? 'pdf' : 'xlsx';
    const params = new HttpParams()
      .set('incluirAgotados', String(incluirAgotados))
      .set('formato', fmt);
    this.exportarInventarioGeneral(params).subscribe({
      next: blob => descargarBlob(blob, `inventario_${Date.now()}.${ext}`),
      error: () => alert('No se pudo generar el reporte de inventario. Intentá de nuevo.'),
    });
  }

  private exportarInventarioGeneral(params: HttpParams): Observable<Blob> {
    return this.http
      .get(`/api/reportes/inventario-general`, { params, responseType: 'blob' })
      .pipe(catchError(err => throwError(() => err)));
  }
}
