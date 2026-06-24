import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { descargarBlob } from '../../util';

@Injectable({
  providedIn: 'root'
})
export class BienExportService {
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
