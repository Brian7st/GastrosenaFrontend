import { Component, ChangeDetectionStrategy, input, output, signal, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaBarYBarismo, ComandaItem } from '../../models/comanda.model';
import { ComandaService } from '../../data-access/comanda.service';
import { Receta } from '../../models/receta.model';
import { ButtonComponent, LucideIconComponent } from '@restaurant/shared/ui';
import { DetalleRecetaComponent } from '../detalle-receta/detalle-receta.component';

@Component({
  selector: 'restaurant-comanda-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LucideIconComponent, DetalleRecetaComponent],
  templateUrl: './comanda-card.component.html',
  styleUrl: './comanda-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.modal-active]': "vistaActual() !== 'platos'"
  }
})
export class ComandaCardComponent implements OnInit, OnDestroy {
  comanda = input.required<ComandaBarYBarismo>();
  iniciarPlato = output<string>();
  finalizarPlato = output<string>();

  now = signal(new Date().getTime());
  vistaActual = signal<'platos' | 'detalles' | 'receta'>('platos');
  recetaActiva = signal<Receta | null>(null);
  comandaService = inject(ComandaService);
  expandedPlates = signal<Set<string>>(new Set());

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      const items = this.comanda().items ?? [];
      const allIds = new Set(items.map((i) => i.idDetalleComanda));
      this.expandedPlates.set(allIds);
    });
  }

  ngOnInit() {
    this.intervalId = setInterval(() => this.now.set(new Date().getTime()), 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  togglePlate(idDetalle: string) {
    const current = new Set(this.expandedPlates());
    if (current.has(idDetalle)) current.delete(idDetalle);
    else current.add(idDetalle);
    this.expandedPlates.set(current);
  }

  isPlateExpanded(idDetalle: string): boolean {
    return this.expandedPlates().has(idDetalle);
  }

  verDetalles() {
    this.vistaActual.set('detalles');
  }

  alternarReceta(item: ComandaItem) {
    if (item.idReceta) {
      this.recetaActiva.set(null);
      this.vistaActual.set('receta');
      this.comandaService.getRecetaById(item.idReceta).subscribe({
        next: (receta) => this.recetaActiva.set(receta),
        error: () => this.mostrarErrorPlaceholder()
      });
    }
  }

  mostrarErrorPlaceholder() {
    this.vistaActual.set('receta');
    this.recetaActiva.set({
      idReceta: 'ERROR',
      nombreReceta: 'Receta no disponible',
      nombreCategoria: '',
      temperatura: '',
      tiempoPreparacion: 0,
      precioUnitario: 0,
      ingredientes: [],
      pasos: [{ orden: 1, descripcionPaso: 'No se pudo conectar con el servidor.', notasAdicionales: '' }]
    });
  }

  cerrarVista() {
    this.vistaActual.set('platos');
    this.recetaActiva.set(null);
  }

  iniciar(item: ComandaItem) {
    if (item.estado === 'ESPERA') this.iniciarPlato.emit(item.idDetalleComanda);
  }

  iniciarTodos() {
    this.comanda().items?.forEach(item => {
      if (item.estado === 'ESPERA') this.iniciarPlato.emit(item.idDetalleComanda);
    });
  }

  finalizar(item: ComandaItem) {
    if (item.estado === 'PREPARANDO') this.finalizarPlato.emit(item.idDetalleComanda);
  }

  getTiempoTranscurrido(horaIso?: string): number {
    if (!horaIso) return 0;
    return Math.floor((this.now() - new Date(horaIso).getTime()) / 60000);
  }
}