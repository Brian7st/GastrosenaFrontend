export interface NavItem {
  label: string;
  ruta: string;
  icono: string;
  insignia?: number;
  insigniaAlerta?: boolean;
}

export interface NavGrupo {
  etiqueta: string;
  items: NavItem[];
}

export interface PerfilConfig {
  nombre?: string;
  avatarUrl?: string;
}

export interface BarraLateralConfig {
  titulo: string;
  subtitulo?: string;
  logoUrl?: string;
  grupos: NavGrupo[];
}

export interface TopNavLink {
  label: string;
  ruta: string;
}
