import { Injectable, inject, signal, computed } from '@angular/core';
import { NotificacionesService } from './notificaciones.service';
import {
  Notificacion,
  EstadoNotificacion,
  FiltrosNotificacion,
} from '../models/notificaciones.model';

@Injectable({ providedIn: 'root' })
export class NotificacionesFacade {
  private readonly service = inject(NotificacionesService);

  // ── Estado ────────────────────────────────────────────────────────────────
  readonly notificaciones = signal<Notificacion[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly noLeidas = computed(() =>
    this.notificaciones().filter(n => n.estado === 'no_leida').length
  );

  // ── Métodos ───────────────────────────────────────────────────────────────
  cargarNotificaciones(filtros?: FiltrosNotificacion): void {
    this.cargando.set(true);
    this.error.set(null);

    this.service.getNotificaciones(filtros).subscribe({
      next: (data) => {
        this.notificaciones.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando notificaciones:', err);
        this.error.set('Error al cargar las notificaciones');
        this.cargando.set(false);
      },
    });
  }

  marcarComoLeida(id: string): void {
    this.service.marcarComoLeida(id).subscribe({
      next: () => {
        this.notificaciones.update(list =>
          list.map(n => n.id === id ? { ...n, estado: 'leida' as EstadoNotificacion } : n)
        );
      },
      error: (err) => console.error('Error marcando notificación:', err),
    });
  }

  marcarTodasLeidas(): void {
    this.service.marcarTodasLeidas().subscribe({
      next: () => {
        this.notificaciones.update(list =>
          list.map(n => ({ ...n, estado: 'leida' as EstadoNotificacion }))
        );
      },
      error: (err) => console.error('Error marcando todas como leídas:', err),
    });
  }

  seleccionarNotificacion(notificacion: Notificacion): void {
    this.marcarComoLeida(notificacion.id);
  }
}