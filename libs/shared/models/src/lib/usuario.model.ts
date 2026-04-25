export enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  CONTADORA = 'CONTADORA',
  INSTRUCTOR = 'INSTRUCTOR',
  CHEF = 'CHEF',
  LIDER_BAR = 'LIDER_BAR',
  MESERO = 'MESERO',
  BARTENDER = 'BARTENDER',
  AUXILIAR_COCINA = 'AUXILIAR_COCINA',
  CAJERO = 'CAJERO',
  ADMIN_COCINA = 'ADMIN_COCINA',
  ADMIN_BAR = 'ADMIN_BAR',
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  creadoEn: Date;
}
