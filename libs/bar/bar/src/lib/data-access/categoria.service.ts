import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private url = '/api/barybarismo/categorias';

  categorias = signal<Categoria[]>([]);

  listar() {
    this.http.get<Categoria[]>(this.url).subscribe({
      next: (data) => {
        this.categorias.set(data ?? []);
      },
      error: (err) => {
        console.error('Error al cargar categorías desde el backend:', err);
        this.categorias.set([]);
      }
    });
  }

  guardarCategoria(datos: { nombreCategoria: string }) {
    return this.http.post<Categoria>(this.url, datos);
  }

  actualizarCategoria(id: string, datos: { nombreCategoria: string }) {
    return this.http.put<Categoria>(`${this.url}/${id}`, datos);
  }

  eliminarCategoria(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
