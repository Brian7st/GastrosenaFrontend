import { Component, ChangeDetectionStrategy, input, output, signal, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaBarYBarismo } from '../../models/comanda.model';
import { ComandaService } from '../../data-access/comanda.service';
import { RecetaService } from '../../data-access/receta.service';
import { Receta } from '../../models/receta.model';
import { ButtonComponent, LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-comanda-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LucideIconComponent],
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
  vistaActual = signal<'platos' | 'detalles' | 'receta'>('platos');
  recetaActiva = signal<Receta | null>(null);
  expandedPlates = signal<Set<string>>(new Set());

  comandaService = inject(ComandaService);
  recetaService = inject(RecetaService);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      this.expandedPlates.set(new Set([this.comanda().idComanda]));
    });
  }

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

  alternarReceta(nombreBebida?: string) {
    if (!nombreBebida) return;

    if (this.recetaService.recetas().length === 0) {
      this.recetaService.listar();
    }

    this.recetaActiva.set(null);
    this.vistaActual.set('receta');

    const recetasList = this.recetaService.recetas();
    const recetaLocal = recetasList.find(
      (r) => r.nombreReceta.toLowerCase().trim() === nombreBebida.toLowerCase().trim()
    );

    if (recetaLocal) {
      this.recetaActiva.set(recetaLocal);
    } else {
      const recetaAproximada = recetasList.find(
        (r) => r.nombreReceta.toLowerCase().includes(nombreBebida.toLowerCase())
      );
      if (recetaAproximada) {
        this.recetaActiva.set(recetaAproximada);
      } else {
        this.mostrarErrorPlaceholder(nombreBebida);
      }
    }
  }

  mostrarErrorPlaceholder(nombreBebida: string) {
    this.recetaActiva.set({
      idReceta: 'ERROR',
      nombreReceta: nombreBebida || 'Receta no disponible',
      nombreCategoria: 'Bebidas',
      temperatura: 'Frío',
      tiempoPreparacion: 0,
      precioUnitario: 0,
      ingredientes: [],
      pasos: [
        {
          orden: 1,
          descripcionPaso: `No se pudo encontrar la receta para "${nombreBebida}" en el servidor.`,
          notasAdicionales: 'Verifique si existe la receta registrada para esta bebida.'
        }
      ]
    });
  }

  cerrarVista() {
    this.vistaActual.set('platos');
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

  iniciar() {
    this.iniciarPlato.emit(this.comanda().idComanda);
  }

  finalizar() {
    this.finalizarPlato.emit(this.comanda().idComanda);
  }

  getTiempoTranscurrido(horaIso?: string): number {
    if (!horaIso) return 0;
    const start = new Date(horaIso).getTime();
    return Math.floor((this.now() - start) / 60000);
  }
}
