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
import { I18nService } from '../../i18n/i18n.service';
import { CocinaFacade, AprendizDTO } from '../../data-access/cocina.facade';
import { EvaluacionService } from '../../data-access/evaluacion.service';
import { LucideIconComponent } from '@restaurant/shared/ui';

// ─── Modelos ──────────────────────────────────────────────────────────────────

/** Vista de un aprendiz en la página de evaluación individual */
export interface AprendizIndividualView {
  id: number;
  nombreCompleto: string;
  inicial: string;
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
  readonly aprendiz = signal<AprendizIndividualView | null>(null);

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

  // ── Inyecciones ──────────────────────────────────────────────────────────
  protected readonly i18n = inject(I18nService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(CocinaFacade);
  private evaluacionService = inject(EvaluacionService);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = Number(params['id']);

      if (id) {
        const encontrado = this.facade.aprendices().find(a => a.id === id);

        if (encontrado) {
          const actividades = this.facade.actividades();
          const actividadNombre = actividades.length > 0 ? actividades[0].nombre : null;

          this.aprendiz.set({
            id: encontrado.id,
            nombreCompleto: encontrado.nombreCompleto,
            inicial: encontrado.inicial,
            numeroFicha: encontrado.ficha,
            jornada: encontrado.jornada,
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
    const aprendiz = this.aprendiz();
    if (!aprendiz) return;

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

    const payload = [{
      aprendizId: aprendiz.id,
      resultado: resultado,
      observaciones: this.observaciones.trim()
    }];

    const actividades = this.facade.actividades();
    const actividad = actividades.find(a => a.nombre === aprendiz.actividad);
    if (!actividad) {
      console.error('No se encontró la actividad asociada al aprendiz');
      return;
    }

    this.evaluacionService.evaluarAprendices(actividad.id, payload).subscribe({
      next: () => {
        this.historialEvaluaciones.update(h => [...h, nuevoRegistro]);

        const estadoFacade = resultado === 'aprobo' ? 'Aprobó' : 'No Aprobó';
        this.facade.actualizarEstado(aprendiz.id, estadoFacade);

        this.observaciones = '';
        this.menuEvaluarAbierto.set(false);
      },
      error: (err) => {
        console.error('Error al guardar evaluación individual', err);
      }
    });
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
    const aprendiz = this.aprendiz();
    const resultado = this.resultadoRevaluar();
    if (!resultado || !aprendiz) return;

    const nuevoRegistro: RegistroEvaluacion = {
      resultado: resultado as 'Aprobado' | 'No Aprobado',
      observaciones: this.observacionesRevaluar.trim(),
      fecha: new Date().toLocaleString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      esRevaluacion: true,
    };

    const payload = [{
      aprendizId: aprendiz.id,
      resultado: resultado === 'Aprobado' ? 'aprobo' as const : 'no_aprobo' as const,
      observaciones: this.observacionesRevaluar.trim()
    }];

    const actividades = this.facade.actividades();
    const actividad = actividades.find(a => a.nombre === aprendiz.actividad);
    if (!actividad) {
      console.error('No se encontró la actividad para re-evaluar');
      return;
    }

    this.evaluacionService.evaluarAprendices(actividad.id, payload).subscribe({
      next: () => {
        this.historialEvaluaciones.update(h => [...h, nuevoRegistro]);

        const estadoFacade = resultado === 'Aprobado' ? 'Aprobó' : 'No Aprobó';
        this.facade.actualizarEstado(aprendiz.id, estadoFacade);

        this.modoRevaluar.set(false);
        this.resultadoRevaluar.set('');
        this.observacionesRevaluar = '';
      },
      error: (err) => {
        console.error('Error al re-evaluar', err);
      }
    });
  }

  volver(): void {
    window.history.back();
  }
}