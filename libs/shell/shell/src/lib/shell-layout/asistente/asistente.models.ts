/**
 * Modelos del asistente conversacional (GastroIA).
 *
 * Por ahora alimentan la capa visual con datos mock. Cuando se conecte
 * el backend, `MensajeChat` es el contrato que devolvera el servicio real.
 */

/** Quien emite el mensaje dentro de la conversacion. */
export type AutorMensaje = 'usuario' | 'asistente';

/** Un mensaje individual del hilo de chat. */
export interface MensajeChat {
  id: string;
  autor: AutorMensaje;
  texto: string;
  /** Hora de envio en formato presentacional, p. ej. "10:42 AM". */
  hora?: string;
}

/** Configuracion presentacional del encabezado del panel. */
export interface AsistentePerfil {
  nombre: string;
  estado: string;
  enLinea: boolean;
}
