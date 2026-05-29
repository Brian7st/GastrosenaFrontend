import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta.model';


@Injectable({ providedIn: 'root' })
export class RecetaService {
  private http = inject(HttpClient);
  // URL base para el backend de recetas
  private url = '/api/barybarismo/recetas';

  recetas = signal<Receta[]>([]);

  listar() {
    this.http.get<Receta[]>(this.url).subscribe({
      next: (res) => {
        this.recetas.set(res ?? []);
      },
      error: (err) => {
        console.error('Error al cargar recetas desde el backend:', err);
        this.recetas.set([]);
      }
    });
  }

  buscarPorId(id: string): Observable<Receta> {
    return this.http.get<Receta>(`${this.url}/${id}`);
  }

  guardarRecetaCompleta(datos: Partial<Receta>) {
    return this.http.post(this.url, datos);
  }

  actualizarRecetaCompleta(id: string, datos: Partial<Receta>) {
    return this.http.put(`${this.url}/${id}`, datos);
  }

  eliminarReceta(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
