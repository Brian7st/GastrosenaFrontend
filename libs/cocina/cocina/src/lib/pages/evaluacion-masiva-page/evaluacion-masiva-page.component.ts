import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// ─── Modelo ──────────────────────────────────────────────────────────────────

export interface AprendizMock {
  id: number;
  nombreCompleto: string;
  inicial: string;
  ficha: string;
  jornada: 'Diurna' | 'Nocturna' | 'Mixta';
  estado: 'Pendiente' | 'Aprobó' | 'No Aprobó';
}

// ─── Datos mock ───────────────────────────────────────────────────────────────

const APRENDICES_MOCK: AprendizMock[] = [
  { id: 1, nombreCompleto: 'Camila Rodriguez Torres',  inicial: 'C', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 2, nombreCompleto: 'Andrés Felipe Mora',       inicial: 'A', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 3, nombreCompleto: 'Laura Valentina Gómez',   inicial: 'L', ficha: '2489012', jornada: 'Mixta',    estado: 'Pendiente' },
  { id: 4, nombreCompleto: 'María Fernanda Castro',   inicial: 'M', ficha: '2561234', jornada: 'Diurna',   estado: 'Pendiente' },
  { id: 5, nombreCompleto: 'Valeria Ospina Herrera',  inicial: 'V', ficha: '2632456', jornada: 'Mixta',    estado: 'Pendiente' },
];

// ─── Componente ───────────────────────────────────────────────────────────────

@Component({
  selector: 'restaurant-evaluacion-masiva-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluacion-masiva-page.component.html',
  styleUrl: './evaluacion-masiva-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluacionMasivaPageComponent {

  // ── Datos ────────────────────────────────────────────────────────────────
  readonly aprendices = signal<AprendizMock[]>(APRENDICES_MOCK);

  // ── Selección ────────────────────────────────────────────────────────────
  /** Set reactivo con los IDs de aprendices seleccionados */
  readonly seleccionados = signal<Set<number>>(new Set());

  /** Cantidad reactiva de seleccionados */
  readonly cantidadSeleccionados = computed(() => this.seleccionados().size);

  /** ¿Todos los visibles están seleccionados? */
  readonly todosSeleccionados = computed(
    () =>
      this.aprendices().length > 0 &&
      this.aprendices().every(a => this.seleccionados().has(a.id))
  );

  /** ¿Al menos uno está seleccionado pero no todos? (indeterminate) */
  readonly algunoSeleccionado = computed(
    () =>
      this.cantidadSeleccionados() > 0 && !this.todosSeleccionados()
  );

  // ── UI ───────────────────────────────────────────────────────────────────
  readonly menuEvaluarAbierto = signal<boolean>(false);

  // ── Métodos de selección ─────────────────────────────────────────────────

  isSelected(id: number): boolean {
    return this.seleccionados().has(id);
  }

  toggleSelection(id: number): void {
    const actual = new Set(this.seleccionados());
    if (actual.has(id)) {
      actual.delete(id);
    } else {
      actual.add(id);
    }
    this.seleccionados.set(actual);
  }

  toggleSelectAll(): void {
    if (this.todosSeleccionados()) {
      // Desmarcar todos
      this.seleccionados.set(new Set());
    } else {
      // Seleccionar todos los visibles
      const todos = new Set(this.aprendices().map(a => a.id));
      this.seleccionados.set(todos);
    }
  }

  // ── Menú EVALUAR ─────────────────────────────────────────────────────────

  toggleMenuEvaluar(): void {
    this.menuEvaluarAbierto.update(v => !v);
  }

  cerrarMenuEvaluar(): void {
    this.menuEvaluarAbierto.set(false);
  }

  // ── Submit masivo ────────────────────────────────────────────────────────

  /**
   * Procesa la evaluación masiva.
   * @param resultado  'aprobo' | 'no_aprobo'
   */
  submitEvaluacionMasiva(resultado: 'aprobo' | 'no_aprobo'): void {
    const ids = Array.from(this.seleccionados());
    console.log('[EvaluacionMasiva] Submit:', { ids, resultado });

    // Limpiar selección y cerrar menú
    this.seleccionados.set(new Set());
    this.menuEvaluarAbierto.set(false);
  }

  volver(): void {
    // Navega hacia atrás en el historial del navegador
    window.history.back();
  }

  private router = inject(Router);

  goToIndividual(id: number): void {
    this.router.navigate(['/app/cocina/evaluacion-individual'], { queryParams: { id } });
  }
}
