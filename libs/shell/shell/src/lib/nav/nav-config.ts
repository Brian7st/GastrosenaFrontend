import { BarraLateralConfig, TopNavLink } from './nav.models';

export const TOP_MENU_CONFIG: TopNavLink[] = [];

export const SIDEBAR_CONFIG: BarraLateralConfig = {
  titulo: 'GastroSena',
  subtitulo: 'MONOREPO ANGULAR 20',
  logoUrl: '',

  grupos: [
    {
      etiqueta: 'Principal',
      items: [
        {
          label: 'Dashboard',
          ruta: '/app',
          exact: true,
          icono: 'layout-dashboard',
        },
      ],
    },

    {
      etiqueta: 'Operación',
      items: [
        {
          label: 'Cocina',
          ruta: '/app/cocina',
          icono: 'chef-hat',

          children: [
            { label: 'Inicio',       ruta: '/app/cocina/inicio',       icono: 'layout-dashboard' },
            { label: 'Comandas',     ruta: '/app/cocina/comandas',     icono: 'clipboard-list'   },
            { label: 'Estadísticas', ruta: '/app/cocina/estadisticas', icono: 'bar-chart-2'      },
            { label: 'Recetas',      ruta: '/app/cocina/recetas',      icono: 'book-open'        },
            { label: 'Evaluar',      ruta: '/app/cocina/actividad',    icono: 'graduation-cap'   },
          ],
        },

        {
          label: 'Bar y barismo',
          ruta: '/app/bar',
          icono: 'coffee',

          children: [
            {
              label: 'Inicio',
              ruta: '/app/bar/inicio',
              icono: 'layout-dashboard',
            },
            {
              label: 'Comandas',
              ruta: '/app/bar/comandas',
              icono: 'clipboard-list',
            },
            {
              label: 'Estadísticas',
              ruta: '/app/bar/estadisticas',
              icono: 'bar-chart-2',
            },
            {
              label: 'Recetas',
              ruta: '/app/bar/recetas',
              icono: 'book-open',
            },
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
          icono: 'users',

          children: [
            {
              label: 'Lista',
              ruta: '/app/usuarios/lista',
              icono: 'list',
            },
            {
              label: 'Roles',
              ruta: '/app/usuarios/roles',
              icono: 'shield-check',
            },
            {
              label: 'Gestión de Cuentas',
              ruta: '/app/usuarios/cuentas',
              icono: 'user-cog',
            },
          ],
        },

        {
          label: 'Restaurante',
          ruta: '/app/restaurante',
          icono: 'utensils',

          children: [
            {
              label: 'Mesas',
              ruta: '/app/restaurante/mesas',
              icono: 'layout-grid',
            },
            {
              label: 'Pedidos',
              ruta: '/app/restaurante/pedidos',
              icono: 'receipt',
            },
            {
              label: 'Caja',
              ruta: '/app/restaurante/caja',
              icono: 'banknote',
            },
          ],
        },

        {
          label: 'Inventario',
          ruta: '/app/inventario',
          icono: 'warehouse',

          children: [
            { label: 'Gestión de Bienes',           ruta: '/app/inventario/bienes',             icono: 'package-open'     },
            { label: 'Facturas Electrónicas',       ruta: '/app/inventario/facturas',           icono: 'file-spreadsheet' },
            { label: 'Solicitudes GIL-F-014',       ruta: '/app/inventario/solicitudes-gil',    icono: 'clipboard-check'  },
            { label: 'Solicitudes Insumos',         ruta: '/app/inventario/solicitudes-insumos-page', icono: 'clipboard-list' },
            { label: 'Consolidado de Ejecución',    ruta: '/app/inventario/consolidado',        icono: 'bar-chart-2'      },
            { label: 'Entradas y Salidas (Kardex)', ruta: '/app/inventario/movimientos',        icono: 'arrow-left-right' },
            { label: 'Alertas de Stock',            ruta: '/app/inventario/alertas',            icono: 'alert-circle'     },
            { label: 'Presupuesto General',         ruta: '/app/inventario/presupuesto',        icono: 'wallet'           },
            { label: 'Conciliación',                ruta: '/app/inventario/conciliacion',       icono: 'scale'            },
            { label: 'Requisiciones Diarias',       ruta: '/app/inventario/requisiciones',      icono: 'calendar'         },
            { label: 'Actas de Legalización',       ruta: '/app/inventario/actas',              icono: 'file-check'       },
            { label: 'Paquete Probatorio',          ruta: '/app/inventario/paquete-probatorio', icono: 'file-stack'       },
          ],
        },

        {
          label: 'Reportes y estadísticas',
          ruta: '/app/reportes',
          icono: 'pie-chart',

          children: [
            {
              label: 'Ventas',
              ruta: '/app/reportes/ventas',
              icono: 'trending-up',
            },
            {
              label: 'Inventario',
              ruta: '/app/reportes/inventario',
              icono: 'warehouse',
            },
          ],
        },
      ],
    },
  ],
};