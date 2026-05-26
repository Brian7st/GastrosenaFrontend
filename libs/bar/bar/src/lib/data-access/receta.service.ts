import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Receta } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private http = inject(HttpClient);
  // URL base para el backend de recetas
  private url = 'http://localhost:8080/api/recetas';

  recetas = signal<Receta[]>([]);

  listar() {
    this.http.get<Receta[]>(this.url).subscribe({
      next: (res) => {
        this.recetas.set(res && res.length > 0 ? res : this.getMockData());
      },
      error: (err) => {
        console.error('Error al cargar recetas desde el backend. Cargando datos de prueba para visualización:', err);
        this.recetas.set(this.getMockData());
      }
    });
  }

  private getMockData(): Receta[] {
    return [
      {
        idReceta: 'RB-001',
        nombreReceta: 'Margarita Tradicional',
        nombreCategoria: 'Cócteles',
        temperatura: 'Fría',
        tiempoPreparacion: 5,
        precioUnitario: 25000,
        urlImagen: 'https://images.unsplash.com/photo-1568225574514-41d683794625?auto=format&fit=crop&q=80&w=800',
        ingredientes: [
          { nombreIngrediente: 'Tequila Blanco', cantidadRequerida: 50, unidadMedida: 'ml' },
          { nombreIngrediente: 'Licor de Naranja', cantidadRequerida: 25, unidadMedida: 'ml' },
          { nombreIngrediente: 'Zumo de Limón', cantidadRequerida: 25, unidadMedida: 'ml' },
          { nombreIngrediente: 'Sal (para escarchar)', cantidadRequerida: 5, unidadMedida: 'g' }
        ],
        pasos: [
          { orden: 1, descripcionPaso: 'Escarchar el borde de la copa con limón y sal.' },
          { orden: 2, descripcionPaso: 'Agitar todos los ingredientes líquidos en una coctelera con hielo.' },
          { orden: 3, descripcionPaso: 'Servir colando sobre la copa preparada.' }
        ]
      },
      {
        idReceta: 'RB-002',
        nombreReceta: 'Espresso Martini',
        nombreCategoria: 'Cócteles de Café',
        temperatura: 'Fría',
        tiempoPreparacion: 5,
        precioUnitario: 28000,
        urlImagen: 'https://images.unsplash.com/photo-1625244510065-ceb8c47f48e3?auto=format&fit=crop&q=80&w=800',
        ingredientes: [
          { nombreIngrediente: 'Vodka', cantidadRequerida: 50, unidadMedida: 'ml' },
          { nombreIngrediente: 'Licor de Café', cantidadRequerida: 25, unidadMedida: 'ml' },
          { nombreIngrediente: 'Café Espresso', cantidadRequerida: 30, unidadMedida: 'ml' },
          { nombreIngrediente: 'Sirope Simple', cantidadRequerida: 10, unidadMedida: 'ml' }
        ],
        pasos: [
          { orden: 1, descripcionPaso: 'Preparar el espresso y dejar enfriar ligeramente.' },
          { orden: 2, descripcionPaso: 'Agitar enérgicamente todos los ingredientes con hielo.' },
          { orden: 3, descripcionPaso: 'Servir en copa de martini colando dos veces.' }
        ]
      },
      {
        idReceta: 'RB-003',
        nombreReceta: 'Capuchino Clásico',
        nombreCategoria: 'Bebidas Calientes',
        temperatura: 'Caliente',
        tiempoPreparacion: 8,
        precioUnitario: 8000,
        urlImagen: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=800',
        ingredientes: [
          { nombreIngrediente: 'Café Espresso', cantidadRequerida: 30, unidadMedida: 'ml' },
          { nombreIngrediente: 'Leche entera', cantidadRequerida: 150, unidadMedida: 'ml' }
        ],
        pasos: [
          { orden: 1, descripcionPaso: 'Extraer un espresso doble en la taza.' },
          { orden: 2, descripcionPaso: 'Vaporizar la leche hasta obtener una microespuma sedosa.' },
          { orden: 3, descripcionPaso: 'Verter la leche sobre el espresso, creando arte latte si es posible.' }
        ]
      }
    ];
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
