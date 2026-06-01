import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificacionesService } from '../data-access/notificaciones.service';
import { Notificacion } from '../models/notificaciones.model';
import {
  PageHeaderComponent,
  StatusBadgeComponent,
  LucideIconComponent,
  ButtonComponent,
} from '@restaurant/shared/ui';
import { Notificacion, EstadoNotificacion, TipoNotificacion } from '../models/notificaciones.model';

const MOCK_NOTIFICACIONES: Notificacion[] = [
  {
    id: '1',
    titulo: 'Cuenta bloqueada',
    mensaje: 'Tu cuenta ha sido bloqueada por múltiples intentos fallidos de inicio de sesión.',
    tipo: 'bloqueo_cuenta',
    estado: 'no_leida',
    fecha: new Date('2025-05-20T10:30:00'),
    icono: 'shield-check',
  },
  {
    id: '2',
    titulo: 'Restablecimiento de contraseña',
    mensaje: 'Se ha generado una solicitud de restablecimiento de contraseña para tu cuenta.',
    tipo: 'restablecimiento_contrasena',
    estado: 'no_leida',
    fecha: new Date('2025-05-19T14:15:00'),
    icono: 'refresh-cw',
  },
  {
    id: '3',
    titulo: 'Contraseña cambiada',
    mensaje: 'Tu contraseña ha sido cambiada correctamente.',
    tipo: 'cambio_contrasena',
    estado: 'leida',
    fecha: new Date('2025-05-18T09:00:00'),
    icono: 'check-circle',
  },
  {
    id: '4',
    titulo: 'Nuevo usuario registrado',
    mensaje: 'Se ha registrado un nuevo usuario en el sistema.',
    tipo: 'registro_usuario',
    estado: 'leida',
    fecha: new Date('2025-05-17T16:45:00'),
    icono: 'user-cog',
  },
  {
    id: '5',
    titulo: 'Alerta de stock',
    mensaje: 'El stock de harina de trigo está por debajo del mínimo permitido.',
    tipo: 'alerta_stock',
    estado: 'no_leida',
    fecha: new Date('2025-05-16T08:00:00'),
    icono: 'alert-circle',
  },
];

@Component({
  selector: 'restaurant-notificaciones-page',
  standalone: true,
  imports: [DatePipe, PageHeaderComponent, StatusBadgeComponent, LucideIconComponent, ButtonComponent],
  templateUrl: './notificaciones-page.component.html',
  styleUrls: ['./notificaciones-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificacionesPageComponent implements OnInit {
  private notificacionesService = inject(NotificacionesService);

  notificaciones = signal<Notificacion[]>([]);
  loading = signal(false);
  noLeidas = signal(0);

  ngOnInit() {
    this.cargarNotificaciones();
    this.contarNoLeidas();
  }

  cargarNotificaciones() {
    this.loading.set(true);
    this.notificacionesService.obtenerNotificaciones().subscribe({
      next: (resp) => {
        this.notificaciones.set(resp.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  contarNoLeidas() {
    this.notificacionesService.contarNoLeidas().subscribe({
      next: (r) => this.noLeidas.set(r.count)
    });
  }

  marcarComoLeida(id: string) {
    this.notificacionesService.marcarComoLeida(id).subscribe(() => {
      this.cargarNotificaciones();
      this.contarNoLeidas();
    });
  }

  marcarTodasLeidas() {
    this.notificacionesService.marcarTodasComoLeidas().subscribe(() => {
      this.cargarNotificaciones();
      this.contarNoLeidas();
    });
  }

  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      BLOQUEO: 'Bloqueo',
      RESTABLECIMIENTO: 'Restablecimiento',
      CAMBIO_CONTRASENA: 'Cambio',
      REGISTRO: 'Registro',
    };
    return labels[tipo] || tipo;
  }
}