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
        idReceta: 'R-001',
        nombreReceta: 'Bandeja Paisa',
        nombreCategoria: 'Plato Principal',
        temperatura: 'Caliente',
        tiempoPreparacion: 45,
        precioUnitario: 35000,
        urlImagen: 'https://cdn.colombia.com/sdi/2011/08/08/bandeja-paisa-316100.jpg',
        ingredientes: [
          { nombreIngrediente: 'Frijoles', cantidadRequerida: 200, unidadMedida: 'g' },
          { nombreIngrediente: 'Arroz', cantidadRequerida: 100, unidadMedida: 'g' },
          { nombreIngrediente: 'Chicharrón', cantidadRequerida: 1, unidadMedida: 'porción' }
        ],
        pasos: [
          { orden: 1, descripcionPaso: 'Cocinar los frijoles a presión.' },
          { orden: 2, descripcionPaso: 'Preparar el arroz, freír el chicharrón y el huevo.' }
        ]
      },
      {
        idReceta: 'R-002',
        nombreReceta: 'Ajiaco Santafereño',
        nombreCategoria: 'Sopas',
        temperatura: 'Caliente',
        tiempoPreparacion: 60,
        precioUnitario: 28000,
        urlImagen: 'https://www.mycolombianrecipes.com/wp-content/uploads/2009/02/Ajiaco-Colombiano-1.jpg',
        ingredientes: [
          { nombreIngrediente: 'Papa criolla', cantidadRequerida: 3, unidadMedida: 'unidades' },
          { nombreIngrediente: 'Pollo', cantidadRequerida: 200, unidadMedida: 'g' },
          { nombreIngrediente: 'Guascas', cantidadRequerida: 1, unidadMedida: 'ramo' }
        ],
        pasos: [
          { orden: 1, descripcionPaso: 'Hervir el pollo con los tres tipos de papa.' },
          { orden: 2, descripcionPaso: 'Agregar las guascas al final para dar sabor.' }
        ]
      },
      {
        idReceta: 'R-003',
        nombreReceta: 'Limonada de Coco',
        nombreCategoria: 'Bebidas',
        temperatura: 'Fría',
        tiempoPreparacion: 10,
        precioUnitario: 12000,
        urlImagen: 'https://cdn.colombia.com/sdi/2019/02/12/limonada-de-coco-709591.jpg',
        ingredientes: [
          { nombreIngrediente: 'Crema de coco', cantidadRequerida: 100, unidadMedida: 'ml' },
          { nombreIngrediente: 'Zumo de limón', cantidadRequerida: 50, unidadMedida: 'ml' },
          { nombreIngrediente: 'Hielo', cantidadRequerida: 1, unidadMedida: 'vaso' }
        ],
        pasos: [
          { orden: 1, descripcionPaso: 'Licuar la crema de coco, el limón y el hielo.' },
          { orden: 2, descripcionPaso: 'Servir inmediatamente bien frío.' }
        ]
      }
    ];
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
