import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ingrediente } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  private http = inject(HttpClient);
  private apiUrl = '/api/ingredientes';

  private _ingredientes = signal<Ingrediente[]>([]);
  public ingredientes = this._ingredientes.asReadonly();

  listarIngredientes() {
    this.http.get<unknown>(this.apiUrl).subscribe({
      next: (respuesta) => {
        const data = (respuesta && typeof respuesta === 'object' && 'content' in (respuesta as Record<string, unknown>))
          ? (respuesta as { content: Ingrediente[] }).content
          : (respuesta as Ingrediente[]);
        this._ingredientes.set(data && data.length > 0 ? data : this.getMockIngredients());
      },
      error: (err) => {
        console.error('Error al cargar ingredientes desde backend. Usando mocks:', err);
        this._ingredientes.set(this.getMockIngredients());
      }
    });
  }

  obtenerPorId(id: string) {
    return this.http.get<Ingrediente>(`${this.apiUrl}/${id}`);
  }

  private getMockIngredients(): Ingrediente[] {
    return [
      { idIngrediente: '1', nombreIngrediente: 'Café Espresso' },
      { idIngrediente: '2', nombreIngrediente: 'Leche entera' },
      { idIngrediente: '3', nombreIngrediente: 'Tequila Blanco' },
      { idIngrediente: '4', nombreIngrediente: 'Licor de Naranja' },
      { idIngrediente: '5', nombreIngrediente: 'Zumo de Limón' },
      { idIngrediente: '6', nombreIngrediente: 'Sirope Simple' },
      { idIngrediente: '7', nombreIngrediente: 'Hielo' },
      { idIngrediente: '8', nombreIngrediente: 'Menta Fresca' },
      { idIngrediente: '9', nombreIngrediente: 'Agua Tónica' }
    ];
  }
}
