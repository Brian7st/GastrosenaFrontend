import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditoriaIncidencia } from '../models/incidencia.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private http = inject(HttpClient);
  private apiUrl = '/api/cocina/incidencias';
  obtenerPorTipo(tipo: 'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION'): Observable<AuditoriaIncidencia[]> {
    return this.http.get<AuditoriaIncidencia[]>(`${this.apiUrl}/tipo/${tipo}`);
  }
}
