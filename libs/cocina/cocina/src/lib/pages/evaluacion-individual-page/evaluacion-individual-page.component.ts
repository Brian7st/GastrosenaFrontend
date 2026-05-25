import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CocinaFacade } from '../../data-access/cocina.facade';
import { EvaluacionRequestDTO } from '../../data-access/evaluacion.service';
import { LucideIconComponent } from '@restaurant/shared/ui';

// ─── Modelo ──────────────────────────────────────────────────────────────────

export interface AprendizIndividualMock {
  id: number;
  nombreCompleto: string;
  inicial: string;
  documento: string;
  jornada: string;
  numeroFicha: string;
  actividad: string | null;
}

// ─── Datos mock (fallback cuando no hay datos del backend) ───────────────────

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

  /** ID de la actividad en la que se evalúa (viene por queryParam 'actividadId') */
  actividadId: number | null = null;

  // ── Estado del formulario ─────────────────────────────────────────────────
  /** Texto del textarea de observaciones (bidireccional con ngModel) */
  observaciones = '';

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
      const actId = Number(params['actividadId']);

      // Guardar el ID de la actividad para poder persistir la evaluación
      if (actId) {
        this.actividadId = actId;
      }

      if (id) {
        const aprendizEncontrado = this.facade
          .aprendices()
          .find(a => a.id === id);

        if (aprendizEncontrado) {
          this.aprendiz.set({
            ...APRENDIZ_MOCK,
            id: aprendizEncontrado.id,
            nombreCompleto: aprendizEncontrado.nombreCompleto,
            inicial: aprendizEncontrado.inicial,
            numeroFicha: aprendizEncontrado.ficha,
            jornada: aprendizEncontrado.jornada,
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

  // ── Submit individual ────────────────────────────────────────────────────

  /**
   * Procesa la evaluación individual.
   * @param resultado 'aprobo' | 'no_aprobo'
   */
  submitEvaluacionIndividual(resultado: 'aprobo' | 'no_aprobo'): void {
    const payload: EvaluacionRequestDTO = {
      aprendizId: this.aprendiz().id,
      observaciones: this.observaciones.trim(),
      resultado,
    };

    console.log(
      '[EvaluacionIndividual] Submit:',
      JSON.stringify(payload, null, 2)
    );

    // Persistir en backend si tenemos el actividadId (flujo normal desde masiva-page)
    if (this.actividadId) {
      this.facade.evaluarAprendices(this.actividadId, [payload]);
    } else {
      // Fallback: actualización local optimista si no hay contexto de actividad
      const estadoStr = resultado === 'aprobo' ? 'Aprobó' : 'No Aprobó';
      this.facade.actualizarEstado(this.aprendiz().id, estadoStr);
    }

    // Limpiar formulario y cerrar menú
    this.observaciones = '';
    this.menuEvaluarAbierto.set(false);
  }

  volver(): void {
    window.history.back();
  }
}