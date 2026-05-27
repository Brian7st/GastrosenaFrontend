export type TipoNotificacion =
  | 'bloqueo_cuenta'
  | 'restablecimiento_contrasena'
  | 'cambio_contrasena'
  | 'registro_usuario'
  | 'alerta_stock'
  | 'pedido'
  | 'general';

export type EstadoNotificacion = 'leida' | 'no_leida';

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: TipoNotificacion;
  estado: EstadoNotificacion;
  fecha: Date;
  icono?: string;
}

export interface FiltrosNotificacion {
  estado?: EstadoNotificacion | 'todas';
  tipo?: TipoNotificacion | 'todos';
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface NotificacionesContext {
  title: string;
  description: string;
}