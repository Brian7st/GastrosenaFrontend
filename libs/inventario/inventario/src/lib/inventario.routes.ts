import { Routes } from '@angular/router';
import { BienesListPageComponent } from './ui/pages/bienes-list/bienes-list.component';
import { BienDetailPageComponent } from './ui/pages/bien-detail/bien-detail.component';
import { BienExportPageComponent } from './ui/pages/bien-export/bien-export.component';
import { FacturasListPageComponent } from './pages/facturas-page/facturas-list/facturas-list.component';
import { FacturaEditPageComponent } from './pages/facturas-page/factura-edit/factura-edit.component';
import { GilSolicitudDetailPageComponent } from './pages/facturas-page/gil-solicitud-detail/gil-solicitud-detail.component';

export const INVENTARIO_ROUTES: Routes = [
  // ── Gestión de Bienes ────────────────────────────────────────────────────
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'bienes',
  },
  {
    path: 'bienes',
    component: BienesListPageComponent,
  },
  {
    path: 'bienes/exportar',
    component: BienExportPageComponent,
  },
  {
    path: 'bienes/:id',
    component: BienDetailPageComponent,
  },

  // ── GIL-F-014: Solicitudes de Abastecimiento ─────────────────────────────
  {
    path: 'solicitudes-gil',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/solicitudes-page/solicitudes-list/solicitudes-list.component').then(
            m => m.SolicitudesListComponent
          ),
      },
      {
        path: 'nueva',
        loadComponent: () =>
          import('./pages/solicitudes-page/solicitudes-form/solicitudes-form.component').then(
            m => m.SolicitudesFormComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/solicitudes-page/solicitudes-detail/solicitudes-detail.component').then(
            m => m.SolicitudesDetailComponent
          ),
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./pages/solicitudes-page/solicitudes-edit/solicitudes-edit.component').then(
            m => m.SolicitudesEditComponent
          ),
      },
      {
        path: ':id/exportar',
        loadComponent: () =>
          import('./pages/solicitudes-page/solicitudes-export/solicitudes-export.component').then(
            m => m.SolicitudesExportComponent
          ),
      }
    ]
  },

  // ── FE: Facturas Electrónicas ────────────────────────────────────────────
  // Vista 1: Panel de Facturación (listado + KPIs)
  {
    path: 'facturas',
    component: FacturasListPageComponent,
  },
  // Vista de Importar Factura
  {
    path: 'facturas/importar',
    loadComponent: () => import('./pages/facturas-page/factura-import/factura-import.component').then(m => m.FacturaImportPageComponent)
  },
  // Vista 3: Detalle de Factura FEL (Bento Grid)
  {
    path: 'facturas/:id',
    loadComponent: () => import('./pages/facturas-page/factura-detail/factura-detail.component').then(m => m.FacturaDetailPageComponent)
  },
  // Vista 4: Editar Factura FEL (Editable/Lectura antigua)
  {
    path: 'facturas/:id/editar',
    component: FacturaEditPageComponent,
  },
  // Vista 5: Detalle Solicitud GIL F-014
  {
    path: 'facturas/gil/:id',
    component: GilSolicitudDetailPageComponent,
  },

  // ── Consolidado de Ejecución Presupuestal ────────────────────────────────
  {
    path: 'consolidado',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/consolidado-page/consolidado-list/consolidado-list.component').then(m => m.ConsolidadoListComponent)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/consolidado-page/consolidado-create/consolidado-create.component').then(m => m.ConsolidadoCreateComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/consolidado-page/consolidado-detail/consolidado-detail.component').then(m => m.ConsolidadoDetailComponent)
      }
    ]
  },

  // ── Conciliación de Inventario ───────────────────────────────────────────
  {
    path: 'conciliacion',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/conciliacion-page/conciliacion-dashboard/conciliacion-dashboard.component').then(
            m => m.ConciliacionDashboardComponent
          ),
      },
      {
        path: 'toma-fisica',
        loadComponent: () =>
          import('./pages/conciliacion-page/conciliacion-toma-fisica/conciliacion-toma-fisica.component').then(
            m => m.ConciliacionTomaFisicaComponent
          ),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/conciliacion-page/conciliacion-historial/conciliacion-historial.component').then(
            m => m.ConciliacionHistorialComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/conciliacion-page/conciliacion-detalle/conciliacion-detalle.component').then(
            m => m.ConciliacionDetalleComponent
          ),
      }
    ]
  },

  // ── Entradas y Salidas (Movimientos / Kardex) ────────────────────────────
  {
    path: 'movimientos',
    loadComponent: () => import('./pages/kardex-page/movimientos-list/movimientos-list.component').then(m => m.MovimientosListComponent),
    children: [
      {
        path: 'entrada',
        loadComponent: () => import('./pages/kardex-page/movimiento-entrada/movimiento-entrada.component').then(m => m.MovimientoEntradaComponent)
      },
      {
        path: 'entrada-gil',
        loadComponent: () => import('./pages/kardex-page/movimiento-entrada-gil/movimiento-entrada-gil.component').then(m => m.MovimientoEntradaGilComponent)
      },
      {
        path: 'salida',
        loadComponent: () => import('./pages/kardex-page/movimiento-salida/movimiento-salida.component').then(m => m.MovimientoSalidaComponent)
      },
      {
        path: 'exportar',
        loadComponent: () => import('./pages/kardex-page/movimiento-export/movimiento-export.component').then(m => m.MovimientoExportComponent)
      }
    ]
  },
  {
    path: 'movimientos/:id',
    loadComponent: () => import('./pages/kardex-page/movimiento-detail/movimiento-detail.component').then(m => m.MovimientoDetailComponent)
  },

  // ── Alertas de Stock ─────────────────────────────────────────────────────
  {
    path: 'alertas',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/alertas-page/alertas-list/alertas-list.component').then(
            m => m.AlertasListComponent
          ),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/alertas-page/alertas-historial/alertas-historial.component').then(
            m => m.AlertasHistorialComponent
          ),
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./pages/alertas-page/alertas-config/alertas-config.component').then(
            m => m.AlertasConfigComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/alertas-page/alerta-detail/alerta-detail.component').then(
            m => m.AlertaDetailComponent
          ),
        children: [
          {
            path: 'resolver',
            loadComponent: () =>
              import('./pages/alertas-page/alerta-detail/alerta-resolver/alerta-resolver.component').then(
                m => m.AlertaResolverComponent
              ),
          },
        ],
      },
    ],
  },

  // ── Presupuesto General ──────────────────────────────────────────────────
  {
    path: 'presupuesto',
    loadComponent: () =>
      import('./pages/presupuesto-page/presupuesto-dashboard/presupuesto-dashboard.component').then(
        m => m.PresupuestoDashboardComponent
      ),
    children: [
      {
        path: 'registrar',
        loadComponent: () =>
          import('./pages/presupuesto-page/presupuesto-registrar/presupuesto-registrar.component').then(
            m => m.PresupuestoRegistrarComponent
          ),
      },
      {
        path: 'traslado',
        loadComponent: () =>
          import('./pages/presupuesto-page/presupuesto-traslado/presupuesto-traslado.component').then(
            m => m.PresupuestoTrasladoComponent
          ),
      },
      {
        path: 'exportar',
        loadComponent: () =>
          import('./pages/presupuesto-page/presupuesto-exportar/presupuesto-exportar.component').then(
            m => m.PresupuestoExportarComponent
          ),
      },
      {
        path: 'cargar-gil',
        loadComponent: () =>
          import('./pages/presupuesto-page/presupuesto-cargar-gil/presupuesto-cargar-gil.component').then(
            m => m.PresupuestoCargarGilComponent
          ),
      },
    ],
  },

  // ── Requisiciones (Formato 45-S) ─────────────────────────────────────────
  {
    path: 'requisiciones',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/requisiciones-page/requisiciones-dashboard/requisiciones-dashboard.component').then(
            m => m.RequisicionesDashboardComponent
          ),
      },
      {
        path: 'nueva',
        loadComponent: () =>
          import('./pages/requisiciones-page/requisiciones-create/requisiciones-create.component').then(
            m => m.RequisicionesCreateComponent
          ),
      },
      {
        path: 'despacho/:id',
        loadComponent: () =>
          import('./pages/requisiciones-page/requisiciones-despacho/requisiciones-despacho.component').then(
            m => m.RequisicionesDespachoComponent
          ),
      },
      {
        path: 'detalle/:id',
        loadComponent: () =>
          import('./pages/requisiciones-page/requisiciones-detalle/requisiciones-detalle.component').then(
            m => m.RequisicionesDetalleComponent
          ),
      },
      {
        path: 'firmar/:id',
        loadComponent: () =>
          import('./pages/requisiciones-page/requisiciones-firmar/requisiciones-firmar.component').then(
            m => m.RequisicionesFirmarComponent
          ),
      },
      {
        path: 'resumen/:id',
        loadComponent: () =>
          import('./pages/requisiciones-page/requisiciones-resumen/requisiciones-resumen.component').then(
            m => m.RequisicionesResumenComponent
          ),
      }
    ]
  },
];
