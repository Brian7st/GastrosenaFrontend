import { Component, ChangeDetectionStrategy, input, output, signal, computed, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaBarYBarismo, ComandaItem } from '../../models/comanda.model';
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

  now = signal(new Date().getTime());
  vistaActual = signal<'platos' | 'detalles' | 'receta'>('platos');
  recetaActiva = signal<Receta | null>(null);

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

  iniciar(item: ComandaItem) {
    this.iniciarPlato.emit(item.idDetalleComanda);
  }

  finalizar(item: ComandaItem) {
    this.finalizarPlato.emit(item.idDetalleComanda);
  }

  puedePrepararTodos = computed(() => {
    const items = this.comanda()?.items;
    return !!items && items.length > 1 && items.some(i => i.estado === 'ESPERA');
  });

  iniciarTodos() {
    for (const item of this.comanda().items || []) {
      if (item.estado === 'ESPERA') {
        this.iniciarPlato.emit(item.idDetalleComanda);
      }
    }
  }

  alternarReceta(item: ComandaItem) {
    if (!item) return;

    this.recetaActiva.set(null);
    this.vistaActual.set('receta');

    if (item.idReceta) {
      this.comandaService.getRecetaById(item.idReceta).subscribe({
        next: (receta) => this.recetaActiva.set(receta),
        error: () => this.buscarRecetaPorNombre(item.nombre)
      });
    } else {
      this.buscarRecetaPorNombre(item.nombre);
    }
  }

  private buscarRecetaPorNombre(nombreBebida: string) {
    if (!nombreBebida) return;

    if (this.recetaService.recetas().length === 0) {
      this.recetaService.listar();
    }

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

  private mostrarErrorPlaceholder(nombreBebida: string) {
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

  verDetalles() {
    this.vistaActual.set('detalles');
  }

  getTiempoTranscurrido(horaIso?: string): number {
    if (!horaIso) return 0;
    const start = new Date(horaIso).getTime();
    return Math.floor((this.now() - start) / 60000);
  }
}
