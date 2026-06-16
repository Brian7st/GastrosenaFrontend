export interface ConfiguracionSeguridad {
  longitudMinimaPassword: number;
  requiereCaracteresEspeciales: boolean;
  tiempoSesionMinutos: number;
  intentosMaximosLogin: number;
  twoFactorAuth: boolean;
}

export interface ConfiguracionSistema {
  version: string;
  modoMantenimiento: boolean;
  ultimoBackup: string | null;
}

export interface ConfiguracionCompleta {
  seguridad: ConfiguracionSeguridad;
  sistema: ConfiguracionSistema;
}

export type Tema = 'light' | 'dark';
export type TamanoFuente = 'pequeno' | 'medio' | 'grande';
export type Idioma = 'es' | 'en';

export interface ConfiguracionApariencia {
  tema: Tema;
  tamanoFuente: TamanoFuente;
}

export interface ConfiguracionAvanzado {
  idioma: Idioma;
}
