export interface ConfiguracionGeneral {
  nombreRestaurante: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  moneda: string;
  zonaHoraria: string;
}

export interface ConfiguracionSeguridad {
  longitudMinimaPassword: number;
  requiereCaracteresEspeciales: boolean;
  tiempoSesionMinutos: number;
  intentosMaximosLogin: number;
  twoFactorAuth: boolean;
}

export interface ConfiguracionFacturacion {
  prefijoFactura: string;
  resolucionDian: string;
  ivaPorcentaje: number;
  entornoPruebas: boolean;
}

export interface ConfiguracionInventario {
  umbralStockMinimo: number;
  unidadMedidaDefault: string;
}

export interface ConfiguracionNotificaciones {
  emailRemitente: string;
  servidorSmtp: string;
  puertoSmtp: number;
  requiereSsl: boolean;
}

export interface ConfiguracionSistema {
  version: string;
  modoMantenimiento: boolean;
  ultimoBackup: string | null;
}

export interface ConfiguracionCompleta {
  general: ConfiguracionGeneral;
  seguridad: ConfiguracionSeguridad;
  facturacion: ConfiguracionFacturacion;
  inventario: ConfiguracionInventario;
  notificaciones: ConfiguracionNotificaciones;
  sistema: ConfiguracionSistema;
}
