import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ComentarioResponse {
  idComentario:  string;
  usuarioNombre: string;
  titulo:        string;
  comentario:    string;
  fechaCreacion: string;
  estado:        string;
}

export interface PageResponse<T> {
  content:       T[];
  totalElements: number;
  totalPages:    number;
  number:        number;
}

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = '/api/comentarios';

  listarAdmin(page = 0, size = 50): Observable<PageResponse<ComentarioResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<ComentarioResponse>>(`${this.baseUrl}/admin`, { params });
  }

  cambiarEstado(id: string, estado: 'APROBADO' | 'RECHAZADO'): Observable<ComentarioResponse> {
    return this.http.put<ComentarioResponse>(
      `${this.baseUrl}/${id}/estado`,
      null,
      { params: { estado } }
    );
  }
}
