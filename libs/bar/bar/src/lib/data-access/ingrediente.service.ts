import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ingrediente } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  private http = inject(HttpClient);
  private apiUrl = '/api/barybarismo/ingredientes';

  private _ingredientes = signal<Ingrediente[]>([]);
  public ingredientes = this._ingredientes.asReadonly();

  listarIngredientes() {
    this.http.get<unknown>(this.apiUrl).subscribe({
      next: (respuesta) => {
        const data = (respuesta && typeof respuesta === 'object' && 'content' in (respuesta as Record<string, unknown>))
          ? (respuesta as { content: Ingrediente[] }).content
          : (respuesta as Ingrediente[]);
        this._ingredientes.set(data ?? []);
      },
      error: (err) => {
        console.error('Error al cargar ingredientes desde el backend:', err);
        this._ingredientes.set([]);
      }
    });
  }

  obtenerPorId(id: string) {
    return this.http.get<Ingrediente>(`${this.apiUrl}/${id}`);
  }
}
