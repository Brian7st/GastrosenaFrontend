import { Rol } from '@restaurant/shared/models';

export const ROL_CLASS_MAP: Record<Rol, string> = {
  [Rol.ADMINISTRADOR]:   'admin',
  [Rol.CONTADORA]:       'contadora',
  [Rol.INSTRUCTOR]:      'instructor',
  [Rol.CHEF]:            'chef',
  [Rol.LIDER_BAR]:       'lider-bar',
  [Rol.MESERO]:          'mesero',
  [Rol.BARTENDER]:       'bartender',
  [Rol.AUXILIAR_COCINA]: 'auxiliar',
  [Rol.CAJERO]:          'cajero',
  [Rol.ADMIN_COCINA]:    'admin-cocina',
  [Rol.ADMIN_BAR]:       'admin-bar',
};

export function getRolClass(rol: Rol): string {
  return ROL_CLASS_MAP[rol] ?? 'default';
}
