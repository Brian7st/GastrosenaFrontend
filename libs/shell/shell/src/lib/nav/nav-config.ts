import { Rol } from '@restaurant/shared/models';
import { BarraLateralConfig, TopNavLink } from './nav.models';

export const TOP_MENU_CONFIG: TopNavLink[] = [];

export const SIDEBAR_CONFIG: BarraLateralConfig = {
  titulo: 'GastroSena',
  subtitulo: 'MONOREPO ANGULAR 20',
  logoUrl: 'data:image/png;base64,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',

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
            { label: 'Evaluar',      tKey: 'nav.evaluar',       ruta: '/app/cocina/actividad',    icono: 'graduation-cap', roles: [Rol.CHEF, Rol.ADMINISTRADOR, Rol.INSTRUCTOR] },
            { label: 'Estadísticas', tKey: 'nav.estadisticas',  ruta: '/app/cocina/estadisticas', icono: 'bar-chart-2'      },
          ],
        },

        {
          label: 'Bar y barismo',
          tKey: 'nav.bar',
          ruta: '/app/bar',
          icono: 'coffee',
          permisos: ['COMANDAS_CONSULTAR', 'RECETAS_CONSULTAR'],
          roles: [Rol.BARTENDER, Rol.ADMINISTRADOR, Rol.CAJERO, Rol.MESERO, Rol.INSTRUCTOR],
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
          // Solo ADMINISTRADOR e INSTRUCTOR pueden ver/gestionar fichas
          // (coincide con @RequireRole del FichaController en usuarios).
          roles: [Rol.ADMINISTRADOR, Rol.INSTRUCTOR],
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
          permisos: ['MODULO_INVENTARIO_VER', 'MODULO_LEGALIZACION_VER'],
          children: [
            { label: 'Gestión de Bienes',           tKey: 'nav.gestion_bienes',     ruta: '/app/inventario/bienes',                   icono: 'package-open',     permisos: ['bienes:ver'] },
            { label: 'Solicitudes Insumos',         tKey: 'nav.solicitudes_insumos', ruta: '/app/inventario/solicitudes-insumos-page', icono: 'clipboard-list',   permisos: ['solicitudes:ver'] },
            { label: 'Solicitudes GIL-F-014',       tKey: 'nav.solicitudes_gil',    ruta: '/app/inventario/solicitudes-gil',          icono: 'clipboard-check',  permisos: ['gil:ver'] },
            { label: 'Facturas Electrónicas',       tKey: 'nav.facturas',           ruta: '/app/inventario/facturas',                 icono: 'file-spreadsheet', permisos: ['facturas:ver'] },
            { label: 'Entradas y Salidas (Kardex)', tKey: 'nav.kardex',             ruta: '/app/inventario/movimientos',              icono: 'arrow-left-right', permisos: ['inventario:ver_movimientos'] },
            { label: 'Consolidado de Ejecución',    tKey: 'nav.consolidado',        ruta: '/app/inventario/consolidado',              icono: 'bar-chart-2',      permisos: ['consolidado:ver'] },
            { label: 'Alertas de Stock',            tKey: 'nav.alertas_stock',      ruta: '/app/inventario/alertas',                  icono: 'alert-circle',     permisos: ['alertas:ver'] },
            { label: 'Presupuesto General',         tKey: 'nav.presupuesto',        ruta: '/app/inventario/presupuesto',              icono: 'wallet',           permisos: ['presupuesto:ver'] },
            { label: 'Conciliación',                tKey: 'nav.conciliacion',       ruta: '/app/inventario/conciliacion',             icono: 'scale',            permisos: ['conciliacion:ver'] },
            { label: 'Requisiciones Diarias',       tKey: 'nav.requisiciones',      ruta: '/app/inventario/requisiciones',            icono: 'calendar',         permisos: ['requisiciones:ver'] },
            { label: 'Actas de Legalización',       tKey: 'nav.actas',              ruta: '/app/inventario/actas',                    icono: 'file-check',       permisos: ['actas:ver'] },
            { label: 'Paquete Probatorio',          tKey: 'nav.paquete_probatorio', ruta: '/app/inventario/paquete-probatorio',       icono: 'file-stack',       permisos: ['paquete:ver'] },
          ],
        },

        {
          label: 'Reportes',
          //tKey: 'nav.reportes',
          ruta: '/app/reportes',
          icono: 'pie-chart',
          permisos: ['MODULO_REPORTES_VER', 'REPORTES_GESTIONAR', 'generar_reporte_facturacion'],
        },
      ],
    },
  ],
};