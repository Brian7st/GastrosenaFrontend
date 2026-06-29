import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../models/receta.model';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const DEFAULT_CATEGORIAS: Categoria[] = [
  { idCategoria: '1', nombreCategoria: 'Calientes' },
  { idCategoria: '2', nombreCategoria: 'Frías' },
  { idCategoria: '3', nombreCategoria: 'Sin Alcohol' },
  { idCategoria: '4', nombreCategoria: 'Con Alcohol' }
];

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private url = '/api/barybarismo/categorias';

  categorias = signal<Categoria[]>([]);

  private getLocalCategorias(): Categoria[] {
    const local = localStorage.getItem('bar_categorias');
    if (local) {
      return JSON.parse(local);
    }
    localStorage.setItem('bar_categorias', JSON.stringify(DEFAULT_CATEGORIAS));
    return DEFAULT_CATEGORIAS;
  }

  private guardarLocalmente(nueva: Categoria) {
    const list = this.getLocalCategorias();
    if (!list.some(c => c.idCategoria === nueva.idCategoria || c.nombreCategoria.toLowerCase().trim() === nueva.nombreCategoria.toLowerCase().trim())) {
      list.push(nueva);
      localStorage.setItem('bar_categorias', JSON.stringify(list));
    }
  }

  private actualizarLocalmente(actualizada: Categoria) {
    const list = this.getLocalCategorias();
    const idx = list.findIndex(c => c.idCategoria === actualizada.idCategoria);
    if (idx !== -1) {
      list[idx] = actualizada;
      localStorage.setItem('bar_categorias', JSON.stringify(list));
    }
  }

  private eliminarLocalmente(id: string) {
    const list = this.getLocalCategorias();
    const filtered = list.filter(c => c.idCategoria !== id);
    localStorage.setItem('bar_categorias', JSON.stringify(filtered));
  }

  listar() {
    const localCats = this.getLocalCategorias();
    this.categorias.set(localCats);

    this.http.get<Categoria[]>(this.url).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Filtrar: solo permitir las categorías de DEFAULT_CATEGORIAS y las creadas localmente
          const allowedNames = new Set(localCats.map(c => c.nombreCategoria.toLowerCase().trim()));
          const filtered = data.filter(c => allowedNames.has(c.nombreCategoria.toLowerCase().trim()));

          // Mezclar con las locales restantes por si acaso
          const merged = [...filtered];
          localCats.forEach(loc => {
            if (!merged.some(c => c.nombreCategoria.toLowerCase().trim() === loc.nombreCategoria.toLowerCase().trim())) {
              merged.push(loc);
            }
          });

          this.categorias.set(merged);
          localStorage.setItem('bar_categorias', JSON.stringify(merged));
        } else {
          this.categorias.set(localCats);
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías desde el backend, usando fallback local:', err);
        this.categorias.set(localCats);
      }
    });
  }

  guardarCategoria(datos: { nombreCategoria: string }) {
    const nueva: Categoria = {
      idCategoria: datos.nombreCategoria.toLowerCase().replace(/\s+/g, '-'),
      nombreCategoria: datos.nombreCategoria
    };

    return this.http.post<Categoria>(this.url, datos).pipe(
      tap((res) => {
        this.guardarLocalmente(res);
      }),
      catchError((err) => {
        console.warn('Backend falló al guardar categoría, guardando localmente:', err);
        this.guardarLocalmente(nueva);
        return of(nueva);
      })
    );
  }

  actualizarCategoria(id: string, datos: { nombreCategoria: string }) {
    const actualizada: Categoria = {
      idCategoria: id,
      nombreCategoria: datos.nombreCategoria
    };

    return this.http.put<Categoria>(`${this.url}/${id}`, datos).pipe(
      tap((res) => {
        this.actualizarLocalmente(res);
      }),
      catchError((err) => {
        console.warn('Backend falló al actualizar categoría, actualizando localmente:', err);
        this.actualizarLocalmente(actualizada);
        return of(actualizada);
      })
    );
  }

  eliminarCategoria(id: string) {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => {
        this.eliminarLocalmente(id);
      }),
      catchError((err) => {
        console.warn('Backend falló al eliminar categoría, eliminando localmente:', err);
        this.eliminarLocalmente(id);
        return of(null);
      })
    );
  }
}
