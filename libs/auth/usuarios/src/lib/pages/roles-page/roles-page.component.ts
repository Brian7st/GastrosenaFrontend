import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { Rol } from '@restaurant/shared/models';
import { LucideIconComponent } from '@restaurant/shared/ui';

interface RolInfo {
  readonly rol:           Rol;
  readonly icono:         string;
  readonly descripcion:   string;
  readonly permisos:      readonly string[];
  readonly totalUsuarios: number;
}

const ROL_CSS_CLASS: Record<Rol, string> = {
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

const MOCK_ROLES: readonly RolInfo[] = [
  {
    rol: Rol.ADMINISTRADOR,
    icono: 'shield',
    descripcion: 'Acceso total al sistema',
    permisos: ['Gestión de usuarios', 'Reportes completos', 'Configuración del sistema', 'Inventario', 'Caja'],
    totalUsuarios: 1,
  },
  {
    rol: Rol.CONTADORA,
    icono: 'banknote',
    descripcion: 'Gestión financiera y reportes',
    permisos: ['Reportes financieros', 'Presupuesto', 'Facturas', 'Caja'],
    totalUsuarios: 1,
  },
  {
    rol: Rol.INSTRUCTOR,
    icono: 'graduation-cap',
    descripcion: 'Gestión académica y evaluaciones',
    permisos: ['Evaluaciones', 'Actividades', 'Recetas', 'Reportes académicos'],
    totalUsuarios: 2,
  },
  {
    rol: Rol.CHEF,
    icono: 'chef-hat',
    descripcion: 'Operaciones de cocina',
    permisos: ['Comandas', 'Recetas', 'Menú', 'Ingredientes'],
    totalUsuarios: 3,
  },
  {
    rol: Rol.LIDER_BAR,
    icono: 'coffee',
    descripcion: 'Operaciones de bar y barismo',
    permisos: ['Comandas bar', 'Recetas bebidas', 'Menú bar'],
    totalUsuarios: 1,
  },
  {
    rol: Rol.MESERO,
    icono: 'utensils',
    descripcion: 'Atención al cliente',
    permisos: ['Mesas', 'Pedidos', 'Comandas'],
    totalUsuarios: 3,
  },
  {
    rol: Rol.BARTENDER,
    icono: 'glass-water',
    descripcion: 'Preparación de bebidas',
    permisos: ['Comandas bar', 'Recetas bebidas'],
    totalUsuarios: 2,
  },
  {
    rol: Rol.AUXILIAR_COCINA,
    icono: 'package',
    descripcion: 'Apoyo en operaciones de cocina',
    permisos: ['Comandas', 'Ingredientes'],
    totalUsuarios: 2,
  },
  {
    rol: Rol.CAJERO,
    icono: 'calculator',
    descripcion: 'Gestión de caja y pagos',
    permisos: ['Caja', 'Pagos', 'Facturas'],
    totalUsuarios: 2,
  },
];

@Component({
  selector: 'restaurant-roles-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './roles-page.component.html',
  styleUrl:    './roles-page.component.scss',
})
export class RolesPageComponent {
  readonly roles = MOCK_ROLES;

  readonly totalUsuarios = MOCK_ROLES.reduce((sum, r) => sum + r.totalUsuarios, 0);
  readonly totalRoles    = MOCK_ROLES.length;

  getRolClass(rol: Rol): string {
    return ROL_CSS_CLASS[rol] ?? 'default';
  }
}
