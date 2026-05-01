import { Rol } from '@restaurant/shared/models';
import { BarraLateralConfig, TopNavLink } from './nav.models';

export const TOP_MENU_CONFIG: TopNavLink[] = [
  { label: 'Inventario',     ruta: '/app/inventario'     },
  { label: 'Abastecimiento', ruta: '/app/abastecimiento' },
  { label: 'Reportes',       ruta: '/app/reportes'       },
];

export const SIDEBAR_CONFIG: BarraLateralConfig = {
  titulo:    'GastroSena',
  subtitulo: 'MONOREPO ANGULAR 20',
  logoUrl:   '',
  grupos: [
    {
      etiqueta: 'Principal',
      items: [
        { label: 'Dashboard', ruta: '/app/inventario', icono: 'layout-dashboard' },
      ],
    },
    {
      etiqueta: 'Operación',
      items: [
        {
          label: 'Cocina',
          ruta: '/app/cocina',
          icono: 'library',
          roles: [Rol.CHEF, Rol.ADMIN_COCINA, Rol.AUXILIAR_COCINA],
          subItems: [
            { label: 'Órdenes',  ruta: '/app/cocina/ordenes',  icono: 'clipboard-check' },
            { label: 'Recetas',  ruta: '/app/cocina/recetas',  icono: 'file-text'       },
            { label: 'Menú',     ruta: '/app/cocina/menu',     icono: 'list'            },
          ],
        },
        {
          label: 'Bar',
          ruta: '/app/bar',
          icono: 'badge',
          roles: [Rol.LIDER_BAR, Rol.ADMIN_BAR, Rol.BARTENDER],
          subItems: [
            { label: 'Pedidos',  ruta: '/app/bar/pedidos',  icono: 'receipt'  },
            { label: 'Cócteles', ruta: '/app/bar/cocteles', icono: 'landmark' },
            { label: 'Stock',    ruta: '/app/bar/stock',    icono: 'package'  },
          ],
        },
      ],
    },
    {
      etiqueta: 'Administración',
      items: [
        {
          label: 'Usuarios',
          ruta: '/app/usuarios',
          icono: 'user-circle',
          subItems: [
            { label: 'Lista',  ruta: '/app/usuarios',       icono: 'list'         },
            { label: 'Roles',  ruta: '/app/usuarios/roles', icono: 'shield-check' },
          ],
        },
        {
          label: 'Restaurante',
          ruta: '/app/restaurante',
          icono: 'list',
          subItems: [
            { label: 'Mesas',    ruta: '/app/restaurante/mesas',    icono: 'layout-dashboard' },
            { label: 'Pedidos',  ruta: '/app/restaurante/pedidos',  icono: 'receipt'          },
            { label: 'Reservas', ruta: '/app/restaurante/reservas', icono: 'calendar'         },
          ],
        },
        {
          label: 'Inventario',
          ruta: '/app/inventario',
          icono: 'warehouse',
          subItems: [
            { label: 'Gestión de Bienes',         ruta: '/app/inventario/bienes',        icono: 'box'             },
            { label: 'Facturas Electrónicas',      ruta: '/app/inventario/facturas',      icono: 'receipt'         },
            { label: 'Solicitudes GIL-F-014',      ruta: '/app/inventario/gil',           icono: 'file-text'       },
            { label: 'Ejecución Presupuestal',     ruta: '/app/inventario/presupuestal',  icono: 'bar-chart'       },
            { label: 'Entradas y Salidas (Kardex)',ruta: '/app/inventario/kardex',        icono: 'history'         },
            { label: 'Alertas de Stock',           ruta: '/app/inventario/alertas',       icono: 'alert-triangle'  },
            { label: 'Presupuesto General',        ruta: '/app/inventario/presupuesto',   icono: 'wallet'          },
            { label: 'Conciliación',               ruta: '/app/inventario/conciliacion',  icono: 'check-square'    },
            { label: 'Requisiciones Diarias',      ruta: '/app/inventario/requisiciones', icono: 'clipboard-check' },
            { label: 'Actas de Legalización',      ruta: '/app/inventario/actas',         icono: 'file-code'       },
            { label: 'Paquete Probatorio',         ruta: '/app/inventario/probatorio',    icono: 'file-stack'      },
          ],
        },
        {
          label: 'Abastecimiento',
          ruta: '/app/abastecimiento',
          icono: 'file-stack',
          subItems: [
            { label: 'Proveedores', ruta: '/app/abastecimiento/proveedores', icono: 'building-2'    },
            { label: 'Órdenes',     ruta: '/app/abastecimiento/ordenes',     icono: 'file-text'     },
            { label: 'Recepción',   ruta: '/app/abastecimiento/recepcion',   icono: 'package-check' },
          ],
        },
        {
          label: 'Reportes',
          ruta: '/app/reportes',
          icono: 'bar-chart',
          subItems: [
            { label: 'Ventas',      ruta: '/app/reportes/ventas',      icono: 'trending-up' },
            { label: 'Inventario',  ruta: '/app/reportes/inventario',  icono: 'package'     },
            { label: 'Rendimiento', ruta: '/app/reportes/rendimiento', icono: 'bar-chart-2' },
          ],
        },
        {
          label: 'Notificaciones',
          ruta: '/app/notificaciones',
          icono: 'bell',
          insignia: 3,
          insigniaAlerta: true,
        },
      ],
    },
  ],
};
