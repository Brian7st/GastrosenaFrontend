import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  PageHeaderComponent,
  SelectFilterComponent,
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
  imports: [
    DatePipe,
    PageHeaderComponent,
    SelectFilterComponent,
    StatusBadgeComponent,
    LucideIconComponent,
    ButtonComponent,
  ],
  templateUrl: './notificaciones-page.component.html',
  styleUrl: './notificaciones-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificacionesPageComponent {

  readonly notificaciones = signal<Notificacion[]>(MOCK_NOTIFICACIONES);
  readonly filtroEstado = signal<string>('todas');
  readonly filtroTipo = signal<string>('todos');
  readonly notificacionSeleccionada = signal<Notificacion | null>(null);

  readonly estadoOpciones = [
    { label: 'Todas', value: 'todas' },
    { label: 'No leídas', value: 'no_leida' },
    { label: 'Leídas', value: 'leida' },
  ];

  readonly tipoOpciones = [
    { label: 'Todos los tipos', value: 'todos' },
    { label: 'Bloqueo de cuenta', value: 'bloqueo_cuenta' },
    { label: 'Restablecimiento de contraseña', value: 'restablecimiento_contrasena' },
    { label: 'Cambio de contraseña', value: 'cambio_contrasena' },
    { label: 'Registro de usuario', value: 'registro_usuario' },
    { label: 'Alerta de stock', value: 'alerta_stock' },
    { label: 'General', value: 'general' },
  ];

  readonly noLeidas = computed(() =>
    this.notificaciones().filter(n => n.estado === 'no_leida').length
  );

  readonly notificacionesFiltradas = computed(() => {
    const estado = this.filtroEstado();
    const tipo = this.filtroTipo();

    return this.notificaciones()
      .filter(n => estado === 'todas' || n.estado === estado)
      .filter(n => tipo === 'todos' || n.tipo === tipo)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  });

  marcarComoLeida(id: string): void {
    this.notificaciones.update(list =>
      list.map(n => n.id === id ? { ...n, estado: 'leida' as EstadoNotificacion } : n)
    );
  }

  marcarTodasLeidas(): void {
    this.notificaciones.update(list =>
      list.map(n => ({ ...n, estado: 'leida' as EstadoNotificacion }))
    );
  }

  seleccionarNotificacion(n: Notificacion): void {
    this.notificacionSeleccionada.set(n);
    this.marcarComoLeida(n.id);
  }

  cerrarDetalle(): void {
    this.notificacionSeleccionada.set(null);
  }

  getTipoLabel(tipo: TipoNotificacion): string {
    const labels: Record<TipoNotificacion, string> = {
      bloqueo_cuenta: 'Bloqueo',
      restablecimiento_contrasena: 'Restablecimiento',
      cambio_contrasena: 'Cambio contraseña',
      registro_usuario: 'Registro',
      alerta_stock: 'Stock',
      pedido: 'Pedido',
      general: 'General',
    };
    return labels[tipo] ?? tipo;
  }
}