import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@restaurant/shared/api';
import { Ficha } from '../models/ficha.model';

@Injectable({ providedIn: 'root' })
export class FichasService extends BaseHttpService {
  private readonly resource = 'fichas';

  obtenerFichas(): Observable<Ficha[]> {
    return this.http.get<Ficha[]>(this.buildUrl(this.resource));
  }

  crearFicha(data: Partial<Ficha>): Observable<Ficha> {
    return this.http.post<Ficha>(this.buildUrl(this.resource), data);
  }

  actualizarFicha(id: string, data: Partial<Ficha>): Observable<Ficha> {
    return this.http.put<Ficha>(this.buildUrl(`${this.resource}/${id}`), data);
  }

  eliminarFicha(id: string): Observable<void> {
    return this.http.delete<void>(this.buildUrl(`${this.resource}/${id}`));
  }

    obtenerFichaPorId(id: string): Observable<Ficha> {
    return this.http.get<Ficha>(this.buildUrl(`${this.resource}/${id}`));
  }
}