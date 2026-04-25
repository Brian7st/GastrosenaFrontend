import { Rol } from '@restaurant/shared/models';
import { BarraLateralConfig, TopNavLink } from './nav.models';

export const TOP_MENU_CONFIG: TopNavLink[] = [
  { label: 'Inventario', ruta: '/app/inventario' },
  { label: 'Facturación', ruta: '/app/facturacion' },
  { label: 'Reportes',    ruta: '/app/reportes'    },
];

export const SIDEBAR_CONFIG: BarraLateralConfig = {
  titulo:    'GastroSena',
  subtitulo: 'MONOREPO ANGULAR 20',
  logoUrl:   '',
  grupos: [
    {
      etiqueta: 'Operación',
      items: [
        { label: 'Cocina',      ruta: '/app/cocina',      icono: 'library',  roles: [Rol.CHEF, Rol.ADMIN_COCINA, Rol.AUXILIAR_COCINA] },
        { label: 'Bar',         ruta: '/app/bar',         icono: 'badge',    roles: [Rol.LIDER_BAR, Rol.ADMIN_BAR, Rol.BARTENDER] },
        { label: 'Restaurante', ruta: '/app/restaurante', icono: 'list' },
      ],
    },
    {
      etiqueta: 'Administración',
      items: [
        { label: 'Inventario',    ruta: '/app/inventario',    icono: 'layout-dashboard' },
        { label: 'Usuarios',      ruta: '/app/usuarios',      icono: 'user-circle' },
        { label: 'Facturación',   ruta: '/app/facturacion',   icono: 'receipt' },
        { label: 'Abastecimiento',ruta: '/app/abastecimiento',icono: 'file-stack' },
        { label: 'Presupuesto',   ruta: '/app/presupuesto',   icono: 'wallet' },
        { label: 'Requisiciones', ruta: '/app/requisiciones', icono: 'arrow-left-right' },
        { label: 'Reportes',      ruta: '/app/reportes',      icono: 'bar-chart' },
        { label: 'Notificaciones',ruta: '/app/notificaciones',icono: 'bell', insignia: 3, insigniaAlerta: true },
      ],
    },
  ],
};
