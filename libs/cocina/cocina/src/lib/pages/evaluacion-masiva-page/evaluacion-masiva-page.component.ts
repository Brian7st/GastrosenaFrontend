import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';

import {
  CocinaFacade,
  ActividadMock,
} from '../../data-access/cocina.facade';

@Component({
  selector: 'restaurant-evaluacion-masiva-page',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './evaluacion-masiva-page.component.html',
  styleUrl: './evaluacion-masiva-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluacionMasivaPageComponent implements OnInit {

  // ── Inyecciones ─────────────────────────────
  private facade = inject(CocinaFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ── Actividad actual ─────────────────────────
  readonly actividadId = signal<number | null>(null);

  readonly actividad = computed<ActividadMock | null>(() => {
    const id = this.actividadId();

    if (!id) {
      return null;
    }

    return (
      this.facade.actividades().find(a => a.id === id) ?? null
    );
  });

  readonly menuEstadoAbierto = signal<boolean>(false);

  readonly estadosActividad: Array<
    'Activa' | 'Pendiente' | 'Finalizada'
  > = ['Activa', 'Pendiente', 'Finalizada'];

  // ── Datos ────────────────────────────────────
  readonly aprendices = this.facade.aprendices;

  readonly aprendicesActivos = computed(() =>
    this.aprendices().filter(a => !a.inactivo)
  );

  readonly aprendicesInactivos = computed(() =>
    this.aprendices().filter(a => a.inactivo)
  );

  // ── Selección ────────────────────────────────
  readonly modoSeleccionAbierto = signal<boolean>(false);

  readonly seleccionados = signal<Set<number>>(new Set());

  readonly cantidadSeleccionados = computed(
    () => this.seleccionados().size
  );

  readonly todosSeleccionados = computed(() => {
    const activos = this.aprendicesActivos();

    return (
      activos.length > 0 &&
      activos.every(a => this.seleccionados().has(a.id))
    );
  });

  readonly algunoSeleccionado = computed(
    () =>
      this.cantidadSeleccionados() > 0 &&
      !this.todosSeleccionados()
  );

  // ── UI ───────────────────────────────────────
  readonly menuEvaluarAbierto = signal<boolean>(false);

  // ── Init ─────────────────────────────────────
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      const id = Number(params['actividadId']);

      if (id) {
        this.actividadId.set(id);
      }
    });
  }

  // ── Estado actividad ─────────────────────────
  toggleMenuEstado(): void {
    this.menuEstadoAbierto.update(v => !v);
  }

  cerrarMenuEstado(): void {
    this.menuEstadoAbierto.set(false);
  }

  cambiarEstadoActividad(
    estado: 'Activa' | 'Pendiente' | 'Finalizada'
  ): void {

    const id = this.actividadId();

    if (id) {
      this.facade.actualizarEstadoActividad(id, estado);
    }

    this.menuEstadoAbierto.set(false);
  }

  getEstadoActividadClass(estado: string): string {

    switch (estado) {

      case 'Activa':
        return 'act-estado-activa';

      case 'Pendiente':
        return 'act-estado-pendiente';

      case 'Finalizada':
        return 'act-estado-finalizada';

      default:
        return '';
    }
  }

  // ── Selección ────────────────────────────────
  toggleModoSeleccion(): void {

    this.modoSeleccionAbierto.update(v => !v);

    if (!this.modoSeleccionAbierto()) {

      this.seleccionados.set(new Set());

      this.cerrarMenuEvaluar();
    }
  }

  isSelected(id: number): boolean {
    return this.seleccionados().has(id);
  }

  toggleSelection(id: number): void {

    if (!this.modoSeleccionAbierto()) {
      return;
    }

    const actual = new Set(this.seleccionados());

    if (actual.has(id)) {
      actual.delete(id);
    } else {
      actual.add(id);
    }

    this.seleccionados.set(actual);
  }

  toggleSelectAll(): void {

    if (!this.modoSeleccionAbierto()) {
      return;
    }

    if (this.todosSeleccionados()) {

      this.seleccionados.set(new Set());

    } else {

      const todos = new Set(
        this.aprendicesActivos().map(a => a.id)
      );

      this.seleccionados.set(todos);
    }
  }

  // ── Menú evaluar ─────────────────────────────
  toggleMenuEvaluar(): void {
    this.menuEvaluarAbierto.update(v => !v);
  }

  cerrarMenuEvaluar(): void {
    this.menuEvaluarAbierto.set(false);
  }

  cerrarTodosMenus(): void {
    this.cerrarMenuEvaluar();
    this.cerrarMenuEstado();
  }

  // ── Evaluación masiva ────────────────────────
  submitEvaluacionMasiva(
    resultado: 'aprobo' | 'no_aprobo'
  ): void {

    const ids = Array.from(this.seleccionados());

    const estadoStr =
      resultado === 'aprobo'
        ? 'Aprobó'
        : 'No Aprobó';

    for (const id of ids) {
      this.facade.actualizarEstado(id, estadoStr);
    }

    this.seleccionados.set(new Set());

    this.menuEvaluarAbierto.set(false);

    this.modoSeleccionAbierto.set(false);
  }

  // ── Navegación ───────────────────────────────
  volver(): void {
    window.history.back();
  }

  goToIndividual(id: number): void {

    this.router.navigate(
      ['/app/cocina/evaluacion-individual'],
      {
        queryParams: { id },
      }
    );
  }

  goToActividades(): void {
    this.router.navigate(['/app/cocina/actividades']);
  }
}