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
  comandaActualizada = output<void>();

  now = signal(new Date().getTime());
  showDetalles = signal(false);
  mostrarReceta = signal(false);
  recetaActiva = signal<Receta | null>(null);
  expandedPlates = signal<Set<string>>(new Set());

  comandaService = inject(ComandaService);
  recetaService = inject(RecetaService);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.now.set(new Date().getTime());
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  alternarReceta(idReceta?: string) {
    if (!idReceta) return;

    if (this.recetaService.recetas().length === 0) {
      this.recetaService.listar();
    }

    const receta = this.recetaService.recetas().find(r => r.idReceta === idReceta);
    if (receta) {
      this.recetaActiva.set(receta);
      this.mostrarReceta.set(true);
    } else {
      // Fallback: intentar cargar del backend
      this.recetaActiva.set(null);
      this.mostrarReceta.set(true);
      this.recetaService.buscarPorId(idReceta).subscribe({
        next: (recetaReal) => {
          this.recetaActiva.set(recetaReal);
        },
        error: (err) => {
          console.error('Error al cargar receta desde backend:', err);
          this.recetaActiva.set({
            idReceta: 'ERROR',
            nombreReceta: 'Receta no disponible',
            nombreCategoria: '',
            temperatura: '',
            tiempoPreparacion: 0,
            precioUnitario: 0,
            ingredientes: [],
            pasos: [{ orden: 1, descripcionPaso: 'No se pudo conectar con el servidor para obtener la receta de esta bebida.' }]
          });
        }
      });
    }
  }

  cerrarReceta() {
    this.mostrarReceta.set(false);
    this.recetaActiva.set(null);
  }

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

  iniciarTodos() {
    this.comanda().items?.forEach(item => {
      if (item.estado === 'ESPERA') {
        this.iniciarPlato.emit(item.idDetalleComanda);
      }
    });
  }

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

  getTiempoTranscurrido(horaIso?: string): number {
    if (!horaIso) return 0;
    const start = new Date(horaIso).getTime();
    return Math.floor((this.now() - start) / 60000);
  }
}
