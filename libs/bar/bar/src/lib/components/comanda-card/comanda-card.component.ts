import { Component, ChangeDetectionStrategy, input, output, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaBarYBarismo, ComandaItem } from '../../models/comanda.model';
import { ComandaService } from '../../data-access/comanda.service';
import { RecetaService } from '../../data-access/receta.service';
import { Receta } from '../../models/receta.model';

@Component({
  selector: 'restaurant-comanda-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comanda-card.component.html',
  styleUrl: './comanda-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComandaCardComponent implements OnInit, OnDestroy {
  comanda = input.required<ComandaBarYBarismo>();
  
  
  iniciarPlato = output<string>();
  finalizarPlato = output<string>();

  isExpanded = signal(true);
  now = signal(new Date().getTime());
  showDetalles = signal(false);
  
  mostrarReceta = signal(false);
  recetaActiva = signal<Receta | null>(null);

  comandaService = inject(ComandaService);
  recetaService = inject(RecetaService);
  
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.now.set(new Date().getTime());
    }, 60000); // Actualiza cada minuto
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  alternarReceta(idReceta?: string) {
    if (!idReceta) return;
    // Cargar recetas si no se han cargado
    if (this.recetaService.recetas().length === 0) {
      this.recetaService.listar();
    }
    
    // Buscar la receta en el listado local del servicio
    const receta = this.recetaService.recetas().find(r => r.idReceta === idReceta);
    if (receta) {
      this.recetaActiva.set(receta);
      this.mostrarReceta.set(true);
    } else {
      // Fallback a mock data
      const mockRecetas: Receta[] = [
        {
          idReceta: 'RB-001',
          nombreReceta: 'Margarita Tradicional',
          nombreCategoria: 'Cócteles',
          temperatura: 'Fría',
          tiempoPreparacion: 5,
          precioUnitario: 25000,
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
          nombreReceta: 'Mojito Cubano',
          nombreCategoria: 'Cócteles',
          temperatura: 'Fría',
          tiempoPreparacion: 6,
          precioUnitario: 22000,
          ingredientes: [
            { nombreIngrediente: 'Ron Blanco', cantidadRequerida: 50, unidadMedida: 'ml' },
            { nombreIngrediente: 'Hojas de Menta Fresca', cantidadRequerida: 8, unidadMedida: 'und' },
            { nombreIngrediente: 'Azúcar Blanco', cantidadRequerida: 2, unidadMedida: 'cdtas' },
            { nombreIngrediente: 'Zumo de Lima', cantidadRequerida: 25, unidadMedida: 'ml' },
            { nombreIngrediente: 'Agua con Gas / Soda', cantidadRequerida: 100, unidadMedida: 'ml' }
          ],
          pasos: [
            { orden: 1, descripcionPaso: 'Macerar suavemente las hojas de menta con el azúcar y zumo de lima en el vaso.' },
            { orden: 2, descripcionPaso: 'Añadir hielo picado y el ron blanco.' },
            { orden: 3, descripcionPaso: 'Completar con agua con gas y remover suavemente de abajo hacia arriba.' }
          ]
        },
        {
          idReceta: 'RB-003',
          nombreReceta: 'Cerveza IPA Artesanal',
          nombreCategoria: 'Cervezas',
          temperatura: 'Muy Fría',
          tiempoPreparacion: 2,
          precioUnitario: 15000,
          ingredientes: [
            { nombreIngrediente: 'Cerveza IPA en Barril', cantidadRequerida: 350, unidadMedida: 'ml' }
          ],
          pasos: [
            { orden: 1, descripcionPaso: 'Enfriar el vaso cervecero previamente.' },
            { orden: 2, descripcionPaso: 'Servir la cerveza de grifo inclinando el vaso a 45 grados.' },
            { orden: 3, descripcionPaso: 'Enderezar el vaso al final para generar 2 dedos de espuma perfecta.' }
          ]
        },
        {
          idReceta: 'RB-004',
          nombreReceta: 'Piña Colada',
          nombreCategoria: 'Cócteles',
          temperatura: 'Fría (Frappé)',
          tiempoPreparacion: 7,
          precioUnitario: 24000,
          ingredientes: [
            { nombreIngrediente: 'Ron Blanco', cantidadRequerida: 50, unidadMedida: 'ml' },
            { nombreIngrediente: 'Crema de Coco', cantidadRequerida: 50, unidadMedida: 'ml' },
            { nombreIngrediente: 'Zumo de Piña Natural', cantidadRequerida: 100, unidadMedida: 'ml' },
            { nombreIngrediente: 'Hielo', cantidadRequerida: 1, unidadMedida: 'taza' }
          ],
          pasos: [
            { orden: 1, descripcionPaso: 'Añadir todos los ingredientes en una licuadora.' },
            { orden: 2, descripcionPaso: 'Licuar a alta velocidad hasta obtener una consistencia suave y cremosa.' },
            { orden: 3, descripcionPaso: 'Servir en copa tipo huracán y decorar con un trozo de piña fresca.' }
          ]
        }
      ];
      const found = mockRecetas.find(r => r.idReceta === idReceta) || mockRecetas[0];
      this.recetaActiva.set(found);
      this.mostrarReceta.set(true);
    }
  }

  cerrarReceta() {
    this.mostrarReceta.set(false);
    this.recetaActiva.set(null);
  }

  expandedPlates = signal<Set<string>>(new Set());

  togglePlate(idDetalle: string) {
    const current = new Set(this.expandedPlates());
    if (current.has(idDetalle)) {
      current.delete(idDetalle);
    } else {
      current.add(idDetalle);
    }
    this.expandedPlates.set(current);
  }

  isPlateExpanded(idDetalle: string): boolean {
    return this.expandedPlates().has(idDetalle);
  }

  iniciar(item: ComandaItem) {
    if (item.estado === 'ESPERA') {
      this.iniciarPlato.emit(item.idDetalleComanda);
    }
  }

  finalizar(item: ComandaItem) {
    if (item.estado === 'PREPARANDO') {
      this.finalizarPlato.emit(item.idDetalleComanda);
    }
  }

  getTiempoTranscurrido(horaIso?: string): number {
    if (!horaIso) return 0;
    const start = new Date(horaIso).getTime();
    return Math.floor((this.now() - start) / 60000);
  }

  comandaActualizada = output<void>();

empezarTodo() {
  const comanda = this.comanda();
  if (comanda.estadoPreparacion === 'PENDIENTE') {
    this.comandaService.actualizarEstado(comanda.idComanda.toString(), 'EN_PREPARACION').subscribe({
      next: () => this.comandaActualizada.emit(),
      error: (err) => console.error('Error al iniciar:', err)
    });
  }
}

finalizarTodo() {
  const comanda = this.comanda();
  if (comanda.estadoPreparacion === 'EN_PREPARACION') {
    this.comandaService.actualizarEstado(comanda.idComanda.toString(), 'LISTO').subscribe({
      next: () => this.comandaActualizada.emit(),
      error: (err) => console.error('Error al finalizar:', err)
    });
  }
}
}