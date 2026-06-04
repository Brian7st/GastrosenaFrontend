import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  OnInit,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CocinaFacade } from '../../data-access/cocina.facade';
import { LucideIconComponent } from '@restaurant/shared/ui';

// ─── Modelos ──────────────────────────────────────────────────────────────────

export interface AprendizIndividualMock {
  id: number;
  nombreCompleto: string;
  inicial: string;
  documento: string;
  jornada: string;
  numeroFicha: string;
  actividad: string | null;
}

export interface RegistroEvaluacion {
  resultado: 'Aprobado' | 'No Aprobado';
  observaciones: string;
  fecha: string;
  esRevaluacion: boolean;
}

// ─── Datos mock ───────────────────────────────────────────────────────────────

const APRENDIZ_MOCK: AprendizIndividualMock = {
  id: 1,
  nombreCompleto: 'Camila Rodriguez Torres',
  inicial: 'C',
  documento: 'CC 1032456789',
  jornada: 'Diurna',
  numeroFicha: '2561234',
  actividad: null,
};

// ─── Componente ───────────────────────────────────────────────────────────────

@Component({
  selector: 'restaurant-evaluacion-individual-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  templateUrl: './evaluacion-individual-page.component.html',
  styleUrl: './evaluacion-individual-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluacionIndividualPageComponent implements OnInit {

  // ── Datos ────────────────────────────────────────────────────────────────
  readonly aprendiz = signal<AprendizIndividualMock>(APRENDIZ_MOCK);

  // ── Historial de evaluaciones ─────────────────────────────────────────────
  readonly historialEvaluaciones = signal<RegistroEvaluacion[]>([]);

  readonly tieneEvaluacion = computed(() => this.historialEvaluaciones().length > 0);

  // ── Estado formulario evaluación inicial ──────────────────────────────────
  observaciones = '';

  // ── Estado re-evaluación ──────────────────────────────────────────────────
  readonly modoRevaluar = signal<boolean>(false);
  readonly resultadoRevaluar = signal<'Aprobado' | 'No Aprobado' | ''>('');
  observacionesRevaluar = '';

  // ── UI ───────────────────────────────────────────────────────────────────
  readonly menuEvaluarAbierto = signal<boolean>(false);

  // ── Dependencias ──────────────────────────────────────────────────────────
  private facade = inject(CocinaFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = Number(params['id']);

      if (id) {
        const aprendizEncontrado = this.facade.aprendices().find(a => a.id === id);

        if (aprendizEncontrado) {
          // Buscar la actividad más reciente
          const actividades = this.facade.actividades();
          const actividadNombre = actividades.length > 0 ? actividades[0].nombre : null;

          this.aprendiz.set({
            ...APRENDIZ_MOCK,
            id: aprendizEncontrado.id,
            nombreCompleto: aprendizEncontrado.nombreCompleto,
            inicial: aprendizEncontrado.inicial,
            numeroFicha: aprendizEncontrado.ficha,
            jornada: aprendizEncontrado.jornada,
            actividad: actividadNombre,
          });
        }
      }
    });
  }

  // ── Menú EVALUAR ─────────────────────────────────────────────────────────

  toggleMenuEvaluar(): void {
    this.menuEvaluarAbierto.update(v => !v);
  }

  cerrarMenuEvaluar(): void {
    this.menuEvaluarAbierto.set(false);
  }

  // ── Submit evaluación inicial ─────────────────────────────────────────────

  submitEvaluacionIndividual(resultado: 'aprobo' | 'no_aprobo'): void {
    const resultadoLabel: 'Aprobado' | 'No Aprobado' =
      resultado === 'aprobo' ? 'Aprobado' : 'No Aprobado';

    const nuevoRegistro: RegistroEvaluacion = {
      resultado: resultadoLabel,
      observaciones: this.observaciones.trim(),
      fecha: new Date().toLocaleString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      esRevaluacion: false,
    };

    this.historialEvaluaciones.update(h => [...h, nuevoRegistro]);

    const estadoFacade = resultado === 'aprobo' ? 'Aprobó' : 'No Aprobó';
    this.facade.actualizarEstado(this.aprendiz().id, estadoFacade);

    this.observaciones = '';
    this.menuEvaluarAbierto.set(false);
  }

  // ── Re-evaluar ────────────────────────────────────────────────────────────

  abrirRevaluar(): void {
    this.modoRevaluar.set(true);
    this.resultadoRevaluar.set('');
    this.observacionesRevaluar = '';
  }

  cancelarRevaluar(): void {
    this.modoRevaluar.set(false);
    this.resultadoRevaluar.set('');
    this.observacionesRevaluar = '';
  }

  submitRevaluar(): void {
    const resultado = this.resultadoRevaluar();
    if (!resultado) return;

    const nuevoRegistro: RegistroEvaluacion = {
      resultado: resultado as 'Aprobado' | 'No Aprobado',
      observaciones: this.observacionesRevaluar.trim(),
      fecha: new Date().toLocaleString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      esRevaluacion: true,
    };

    this.historialEvaluaciones.update(h => [...h, nuevoRegistro]);

    const estadoFacade = resultado === 'Aprobado' ? 'Aprobó' : 'No Aprobó';
    this.facade.actualizarEstado(this.aprendiz().id, estadoFacade);

    this.modoRevaluar.set(false);
    this.resultadoRevaluar.set('');
    this.observacionesRevaluar = '';
  }

  volver(): void {
    window.history.back();
  }
}