import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Receta } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private http = inject(HttpClient);
  // URL base para el backend de recetas
  private url = 'http://localhost:8082/api/recetas';
  recetas = signal<Receta[]>([]);

  listar() {
    this.http.get<Receta[]>(this.url).subscribe({
      next: (res) => {
        this.recetas.set(res && res.length > 0 ? res : []);
      },
      error: (err) => {
        console.error('Error al cargar recetas desde el backend:', err);
        this.recetas.set([]);
      }
    });
  }

  guardarRecetaCompleta(datos: any) {
    return this.http.post(this.url, datos);
  }

  actualizarRecetaCompleta(id: string, datos: any) {
    return this.http.put(`${this.url}/${id}`, datos);
  }

  eliminarReceta(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
