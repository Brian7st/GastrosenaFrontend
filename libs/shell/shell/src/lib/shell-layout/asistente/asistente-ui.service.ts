import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Unica fuente de verdad del estado del asistente en el layout.
 *
 * El boton de la barra superior ESCRIBE (toggle/abrir/cerrar); la barra
 * lateral, el contenido y el panel solo LEEN `panelAbierto`. Flujo
 * unidireccional: ningun componente conoce a los demas, todos reaccionan
 * al mismo signal.
 *
 * Al navegar a cualquier modulo (sidebar, barra superior o footer) el panel
 * se cierra solo escuchando al Router. Asi no hay que enganchar `(click)` en
 * cada enlace: una sola regla cubre toda la navegacion.
 */
@Injectable({ providedIn: 'root' })
export class AsistenteUiService {
  private readonly router = inject(Router);

  private readonly _panelAbierto = signal(false);

  /** Estado de apertura del panel del asistente (solo lectura). */
  readonly panelAbierto = this._panelAbierto.asReadonly();

  /** Estado accesible para `aria-expanded`. */
  readonly estadoAria = computed(() => this._panelAbierto());

  constructor() {
    // Cierra el panel ante cualquier navegacion (incluye enlaces de la barra
    // superior y navegacion programatica). Los enlaces del sidebar ademas
    // llaman `cerrar()` en su (click) para un refresco inmediato de la vista.
    this.router.events
      .pipe(
        filter((evento) => evento instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.cerrar());
  }

  abrir(): void {
    this._panelAbierto.set(true);
  }

  cerrar(): void {
    this._panelAbierto.set(false);
  }

  toggle(): void {
    this._panelAbierto.update((abierto) => !abierto);
  }
}
