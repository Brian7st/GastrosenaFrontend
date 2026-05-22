import { Component, ChangeDetectionStrategy, input, output, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comanda, PlatoDetalle, ComandaService, Receta } from '../../data-access/comanda.service';

@Component({
  selector: 'restaurant-comanda-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comanda-card.component.html',
  styleUrl: './comanda-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComandaCardComponent implements OnInit, OnDestroy {
  comanda = input.required<Comanda>();
  
  onIniciarPlato = output<string>();
  onFinalizarPlato = output<string>();

  isExpanded = signal(true);
  now = signal(new Date().getTime());
  showDetalles = signal(false);
  
  mostrarReceta = signal(false);
  recetaActiva = signal<Receta | null>(null);

  comandaService = inject(ComandaService);
  
  private intervalId: any;

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

  alternarReceta(idPlato: string) {
    const receta = this.comandaService.getRecetaMock(idPlato);
    this.recetaActiva.set(receta);
    this.mostrarReceta.set(true);
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

  iniciar(plato: PlatoDetalle) {
    if (plato.estado === 'ESPERA') {
      this.onIniciarPlato.emit(plato.idDetalleComanda);
    }
  }

  finalizar(plato: PlatoDetalle) {
    if (plato.estado === 'PREPARANDO') {
      this.onFinalizarPlato.emit(plato.idDetalleComanda);
    }
  }

  getTiempoTranscurrido(horaIso?: string): number {
    if (!horaIso) return 0;
    const start = new Date(horaIso).getTime();
    return Math.floor((this.now() - start) / 60000);
  }

  empezarTodo() {
    this.comanda().detalles.forEach(plato => {
      if (plato.estado === 'ESPERA') {
        this.onIniciarPlato.emit(plato.idDetalleComanda);
      }
    });
  }

  finalizarTodo() {
    this.comanda().detalles.forEach(plato => {
      if (plato.estado === 'PREPARANDO') {
        this.onFinalizarPlato.emit(plato.idDetalleComanda);
      }
    });
  }
}
