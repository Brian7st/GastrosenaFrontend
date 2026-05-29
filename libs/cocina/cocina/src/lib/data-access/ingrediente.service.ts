import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ingrediente } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  private http = inject(HttpClient); 
  private apiUrl = 'http://localhost:8082/api/ingredientes';

  private _ingredientes = signal<Ingrediente[]>([]);
  public ingredientes = this._ingredientes.asReadonly();

  listarIngredientes() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (respuesta) => {
        if (respuesta && respuesta.content) {
          this._ingredientes.set(respuesta.content);
        } else {
          this._ingredientes.set(respuesta);
        }
      },
      error: (err) => console.error(err)
    });
  }

  obtenerPorId(id: string) {
    return this.http.get<Ingrediente>(`${this.apiUrl}/${id}`);
  }
}
