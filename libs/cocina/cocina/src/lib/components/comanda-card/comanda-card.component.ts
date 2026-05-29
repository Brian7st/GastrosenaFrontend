import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Comanda,
  PlatoDetalle,
  ComandaService,
  Receta,
} from '../../data-access/comanda.service';
import { ButtonComponent, LucideIconComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-comanda-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LucideIconComponent],
  templateUrl:'./comanda-card.component.html',
  styleUrl: './comanda-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComandaCardComponent implements OnInit, OnDestroy {
  comanda = input.required<Comanda>();

  onIniciarPlato = output<string>();
  onFinalizarPlato = output<string>();

  now = signal(new Date().getTime());
  vistaActual = signal<'platos' | 'detalles' | 'receta'>('platos');
  recetaActiva = signal<Receta | null>(null);

  comandaService = inject(ComandaService);

  /**
   * Set de IDs de platos cuyas notas están VISIBLES.
   * Por defecto arranca vacío y se rellena en ngOnInit con todos los platos.
   */
  expandedPlates = signal<Set<string>>(new Set());

  private intervalId: any;

  constructor() {
    // Cuando cambia la comanda (nuevo input), mostramos todas las notas por defecto
    effect(() => {
      const detalles = this.comanda().detalles ?? [];
      const allIds = new Set(detalles.map((p) => p.idDetalleComanda));
      this.expandedPlates.set(allIds);
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

  // ── Ojo: toggle visibilidad de notas de un plato ──────────────────────────
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

  // ── Vistas (Detalles y Receta) ──────────────────────────────────────────────
  verDetalles() {
    this.vistaActual.set('detalles');
  }

  alternarReceta(plato: PlatoDetalle) {
    if (plato.idReceta) {
      console.log('⌛ Cargando receta real para ID:', plato.idReceta);
      // OBLIGATORIO setear recetaActiva en null antes de la petición para disparar el spinner
      this.recetaActiva.set(null);
      this.vistaActual.set('receta');

      this.comandaService.getRecetaById(plato.idReceta).subscribe({
        next: (recetaReal) => {
          console.log('✅ Receta cargada:', recetaReal);
          this.recetaActiva.set(recetaReal);
        },
        error: (err) => {
          console.error('❌ Error fatal cargando receta del backend. Verifique el endpoint y que la BD tenga los datos.', err);
          // FALLBACK: Si falla, al menos muestra un mensaje en lugar de blanco
          this.mostrarErrorPlaceholder();
        }
      });
    }
  }

  mostrarErrorPlaceholder() {
    this.vistaActual.set('receta');
    this.recetaActiva.set({
      idReceta: 'ERROR',
      nombreReceta: 'Receta no disponible en el Backend',
      nombreCategoria: '', tiempoPreparacion: 0, temperatura: '',
      ingredientes: [], pasos: [{idPaso:'e', orden:1, descripcionPaso: 'Hubo un error de conexión al buscar esta receta en el servidor Java. Revise el log de IntelliJ.', notasAdicionales: ''}]
    });
  }

  cerrarVista() {
    this.vistaActual.set('platos');
    this.recetaActiva.set(null);
  }

  // ── Acciones de plato ──────────────────────────────────────────────────────
  iniciar(plato: PlatoDetalle) {
    if (plato.estado === 'ESPERA') {
      this.onIniciarPlato.emit(plato.idDetalleComanda);
    }
  }

  iniciarTodos() {
    this.comanda().detalles.forEach(plato => {
      if (plato.estado === 'ESPERA') {
        this.onIniciarPlato.emit(plato.idDetalleComanda);
      }
    });
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
}
