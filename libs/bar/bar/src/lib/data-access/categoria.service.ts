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
}
