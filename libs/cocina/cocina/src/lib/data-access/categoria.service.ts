import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Categoria } from "../models/receta.model";

@Injectable({ providedIn: 'root'})
export class CategoriaService {
    private http = inject(HttpClient);
    private url = 'http://localhost:8082/api/categorias';

    categorias = signal<Categoria[]>([]);

    listar(){
        this.http.get<Categoria[]>(this.url).subscribe({
          next: (data) => this.categorias.set(data || []),
          error: (err) => console.error(err)
        });
    }
}
