import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/categorias';

  categorias = signal<Categoria[]>([]);

  listar() {
    this.http.get<Categoria[]>(this.url).subscribe({
      next: (data) => {
        this.categorias.set(data && data.length > 0 ? data : this.getMockCategories());
      },
      error: (err) => {
        console.error('Error al cargar categorías desde backend. Usando mocks:', err);
        this.categorias.set(this.getMockCategories());
      }
    });
  }

  private getMockCategories(): Categoria[] {
    return [
      { idCategoria: '1', nombreCategoria: 'Cócteles' },
      { idCategoria: '2', nombreCategoria: 'Cócteles de Café' },
      { idCategoria: '3', nombreCategoria: 'Bebidas Calientes' },
      { idCategoria: '4', nombreCategoria: 'Bebidas Frías' },
      { idCategoria: '5', nombreCategoria: 'Licores' }
    ];
  }
}
