import { Injectable, inject, signal, computed } from '@angular/core';
import { PerfilService } from './perfil.service';
import {
  PerfilUsuario,
  ActualizarPerfilRequest,
  CambiarContrasenaRequest,
  ActividadReciente,
} from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilFacade {
  private readonly service = inject(PerfilService);

  // ── Estado ────────────────────────────────────────────────────────────────
  readonly perfil = signal<PerfilUsuario | null>(null);
  readonly actividad = signal<ActividadReciente[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly cambiandoContrasena = signal(false);
  readonly error = signal<string | null>(null);
  readonly exito = signal<string | null>(null);

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly iniciales = computed(() => {
    const nombre = this.perfil()?.nombre ?? '';
    const apellidos = this.perfil()?.apellidos ?? '';
    return nombre && apellidos
      ? nombre[0] + apellidos[0]
      : nombre.slice(0, 2);
  });

  // ── Métodos ───────────────────────────────────────────────────────────────
  cargarPerfil(userId: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.service.getPerfil(userId).subscribe({
      next: (data) => {
        this.perfil.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.error.set('Error al cargar el perfil');
        this.cargando.set(false);
      },
    });
  }

  cargarActividad(userId: string): void {
    this.service.getActividadReciente(userId).subscribe({
      next: (data) => this.actividad.set(data),
      error: (err) => console.error('Error cargando actividad:', err),
    });
  }

  actualizarPerfil(userId: string, data: ActualizarPerfilRequest): void {
    this.guardando.set(true);
    this.error.set(null);

    this.service.actualizarPerfil(userId, data).subscribe({
      next: (perfil) => {
        this.perfil.set(perfil);
        this.guardando.set(false);
        this.exito.set('Perfil actualizado correctamente');
        setTimeout(() => this.exito.set(null), 3000);
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        this.error.set('Error al actualizar el perfil');
        this.guardando.set(false);
      },
    });
  }

  cambiarContrasena(userId: string, data: CambiarContrasenaRequest): void {
    this.cambiandoContrasena.set(true);
    this.error.set(null);

    this.service.cambiarContrasena(userId, data).subscribe({
      next: () => {
        this.cambiandoContrasena.set(false);
        this.exito.set('Contraseña cambiada correctamente');
        setTimeout(() => this.exito.set(null), 3000);
      },
      error: (err) => {
        console.error('Error cambiando contraseña:', err);
        this.error.set('Error al cambiar la contraseña');
        this.cambiandoContrasena.set(false);
      },
    });
  }

  subirFoto(userId: string, foto: File): void {
    this.service.subirFoto(userId, foto).subscribe({
      next: (res) => {
        this.perfil.update(p => p ? { ...p, fotoUrl: res.fotoUrl } : p);
      },
      error: (err) => {
        console.error('Error subiendo foto:', err);
        this.error.set('Error al subir la foto');
      },
    });
  }

  limpiarMensajes(): void {
    this.error.set(null);
    this.exito.set(null);
  }
}