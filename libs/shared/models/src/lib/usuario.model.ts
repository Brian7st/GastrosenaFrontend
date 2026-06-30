export enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  CONTADORA = 'CONTADORA',
  INSTRUCTOR = 'INSTRUCTOR',
  CHEF = 'CHEF',
  MESERO = 'MESERO',
  BARTENDER = 'BARTENDER',
  AUXILIAR_COCINA = 'AUXILIAR_COCINA',
  CAJERO = 'CAJERO',
  APRENDIZ = 'APRENDIZ',
}
export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;   // ← agregar
  documento: string;   // ← agregar
  email: string;
  rol: Rol;
  activo: boolean;
  creadoEn: Date;
}