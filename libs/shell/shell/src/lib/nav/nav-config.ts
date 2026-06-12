import { BarraLateralConfig, TopNavLink } from './nav.models';

export const TOP_MENU_CONFIG: TopNavLink[] = [];

export const SIDEBAR_CONFIG: BarraLateralConfig = {
  titulo: 'GastroSena',
  subtitulo: 'MONOREPO ANGULAR 20',
  logoUrl: '',

  grupos: [
    {
      etiqueta: 'Principal',
      tKey: 'grupo.principal',
      items: [
        {
          label: 'Dashboard',
          tKey: 'nav.dashboard',
          ruta: '/app/dashboard',
          exact: true,
          icono: 'layout-dashboard',
        },
      ],
    },

    {
      etiqueta: 'Operación',
      tKey: 'grupo.operacion',
      items: [
        {
          label: 'Cocina',
          tKey: 'nav.cocina',
          ruta: '/app/cocina',
          icono: 'chef-hat',
          permisos: ['RECETAS_GESTIONAR', 'RECETAS_CONSULTAR', 'COMANDAS_CONSULTAR'],
          children: [
            { label: 'Inicio',        tKey: 'nav.inicio',        ruta: '/app/cocina/inicio',       icono: 'layout-dashboard' },
            { label: 'Comandas',     tKey: 'nav.comandas',      ruta: '/app/cocina/comandas',     icono: 'clipboard-list'   },
            { label: 'Recetas',      tKey: 'nav.recetas',       ruta: '/app/cocina/recetas',      icono: 'book-open'        },
            { label: 'Evaluar',      tKey: 'nav.evaluar',       ruta: '/app/cocina/actividad',    icono: 'graduation-cap'   },
            { label: 'Estadísticas', tKey: 'nav.estadisticas',  ruta: '/app/cocina/estadisticas', icono: 'bar-chart-2'      },
          ],
        },

        {
          label: 'Bar y barismo',
          tKey: 'nav.bar',
          ruta: '/app/bar',
          icono: 'coffee',
          permisos: ['COMANDAS_CONSULTAR', 'RECETAS_CONSULTAR'],
          children: [
            {
              label: 'Inicio',
              tKey: 'nav.inicio',
              ruta: '/app/bar/inicio',
              icono: 'layout-dashboard',
            },
            {
              label: 'Comandas',
              tKey: 'nav.comandas',
              ruta: '/app/bar/comandas',
              icono: 'clipboard-list',
            },
            {
              label: 'Recetas',
              tKey: 'nav.recetas',
              ruta: '/app/bar/recetas',
              icono: 'book-open',
            },
            {
              label: 'Estadísticas',
              tKey: 'nav.estadisticas',
              ruta: '/app/bar/estadisticas',
              icono: 'bar-chart-2',
            },
          ],
        },
      ],
    },

    {
      etiqueta: 'Administración',
      tKey: 'grupo.administracion',
      items: [
        {
          label: 'Usuarios',
          tKey: 'nav.usuarios',
          ruta: '/app/usuarios',
          icono: 'users',
          permisos: ['USUARIOS_LISTAR', 'USUARIOS_VER'],
          children: [
            { label: 'Lista',              tKey: 'nav.lista',            ruta: '/app/usuarios/lista',    icono: 'list'         },
            { label: 'Roles',              tKey: 'nav.roles',            ruta: '/app/usuarios/roles',    icono: 'shield-check' },
            { label: 'Gestión de Cuentas', tKey: 'nav.gestion_cuentas', ruta: '/app/usuarios/cuentas',  icono: 'user-cog'     },
            { label: 'Comentarios',        tKey: 'nav.comentarios',     ruta: '/app/usuarios/comentarios-admin', icono: 'message-square' },
          ],
        },
        {
          label: 'Fichas',
          ruta: '/app/fichas',
          icono: 'book-open',
          children: [
            { label: 'Lista de Fichas', ruta: '/app/fichas', icono: 'list' },
          ],
        },
        {
          label: 'Restaurante',
          tKey: 'nav.restaurante',
          ruta: '/app/restaurante',
          icono: 'utensils',
          permisos: ['MODULO_MESAS_VER', 'MODULO_PEDIDOS_VER', 'MESAS_CONSULTAR'],
          children: [
            { label: 'Mesas',   tKey: 'nav.mesas',   ruta: '/app/restaurante/mesas',   icono: 'layout-grid' },
            { label: 'Pedidos', tKey: 'nav.pedidos', ruta: '/app/restaurante/pedidos', icono: 'receipt'     },
            { label: 'Caja',    tKey: 'nav.caja',    ruta: '/app/restaurante/caja',    icono: 'banknote'    },
          ],
        },

        {
          label: 'Inventario',
          tKey: 'nav.inventario',
          ruta: '/app/inventario',
          icono: 'warehouse',
          permisos: ['MODULO_INVENTARIO_VER'],
          children: [
            { label: 'Gestión de Bienes',           tKey: 'nav.gestion_bienes',     ruta: '/app/inventario/bienes',                   icono: 'package-open'     },
            { label: 'Solicitudes Insumos',         tKey: 'nav.solicitudes_insumos', ruta: '/app/inventario/solicitudes-insumos-page', icono: 'clipboard-list'   },
            { label: 'Solicitudes GIL-F-014',       tKey: 'nav.solicitudes_gil',    ruta: '/app/inventario/solicitudes-gil',          icono: 'clipboard-check'  },
            { label: 'Facturas Electrónicas',       tKey: 'nav.facturas',           ruta: '/app/inventario/facturas',                 icono: 'file-spreadsheet' },
            { label: 'Entradas y Salidas (Kardex)', tKey: 'nav.kardex',             ruta: '/app/inventario/movimientos',              icono: 'arrow-left-right' },
            { label: 'Consolidado de Ejecución',    tKey: 'nav.consolidado',        ruta: '/app/inventario/consolidado',              icono: 'bar-chart-2'      },
            { label: 'Alertas de Stock',            tKey: 'nav.alertas_stock',      ruta: '/app/inventario/alertas',                  icono: 'alert-circle'     },
            { label: 'Presupuesto General',         tKey: 'nav.presupuesto',        ruta: '/app/inventario/presupuesto',              icono: 'wallet'           },
            { label: 'Conciliación',                tKey: 'nav.conciliacion',       ruta: '/app/inventario/conciliacion',             icono: 'scale'            },
            { label: 'Requisiciones Diarias',       tKey: 'nav.requisiciones',      ruta: '/app/inventario/requisiciones',            icono: 'calendar'         },
            { label: 'Actas de Legalización',       tKey: 'nav.actas',              ruta: '/app/inventario/actas',                    icono: 'file-check'       },
            { label: 'Paquete Probatorio',          tKey: 'nav.paquete_probatorio', ruta: '/app/inventario/paquete-probatorio',       icono: 'file-stack'       },
          ],
        },

        {
          label: 'Reportes y estadísticas',
          tKey: 'nav.reportes',
          ruta: '/app/reportes',
          icono: 'pie-chart',
          permisos: ['MODULO_REPORTES_VER', 'REPORTES_GESTIONAR', 'generar_reporte_facturacion'],
          children: [
            {
              label: 'Ventas',
              tKey: 'nav.ventas',
              ruta: '/app/reportes/ventas',
              icono: 'trending-up',
            },
            {
              label: 'Inventario',
              tKey: 'nav.inventario_reportes',
              ruta: '/app/reportes/inventario',
              icono: 'warehouse',
            },

          ],
        },
      ],
    },
  ],
};