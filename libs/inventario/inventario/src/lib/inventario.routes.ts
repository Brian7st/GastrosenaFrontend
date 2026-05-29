import { Routes } from '@angular/router';


export const INVENTARIO_ROUTES: Routes = [
  // ── Gestión de Bienes ────────────────────────────────────────────────────
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'bienes',
  },
  {
    path: 'bienes',
    loadComponent: () => import('./ui/pages/bienes-list/bienes-list.component').then(m => m.BienesListPageComponent),
  },
  {
    path: 'bienes/exportar',
    loadComponent: () => import('./ui/pages/bien-export/bien-export.component').then(m => m.BienExportPageComponent),
  },
  {
    path: 'bienes/:id',
    loadComponent: () => import('./ui/pages/bien-detail/bien-detail.component').then(m => m.BienDetailPageComponent),
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
        path: 'generar',
        loadComponent: () =>
          import('./pages/solicitudes-page/solicitudes-generar/solicitudes-generar.component').then(
            m => m.SolicitudesGenerarComponent
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

  // ── Solicitudes de Insumos (Bandeja de Aprobación) ───────────────────────
  {
    path: 'solicitudes-insumos-page',
    loadComponent: () => import('./pages/solicitudes-insumos-page/solicitudes-insumos-list/solicitudes-insumos-list.component').then(m => m.SolicitudesInsumosListComponent)
  },
  {
    path: 'solicitudes-insumos-page/nueva',
    loadComponent: () => import('./pages/solicitudes-insumos-page/solicitudes-insumos-form/solicitudes-insumos-form.component').then(m => m.SolicitudesInsumosFormComponent)
  },


  {
    path: 'solicitudes-insumos-page/:id/consolidacion',
    loadComponent: () => import('./pages/solicitudes-insumos-page/solicitudes-insumos-consolidacion/solicitudes-insumos-consolidacion.component').then(m => m.SolicitudesInsumosConsolidacionComponent)
  },

  {
    path: 'solicitudes-insumos-page/:id/editar',
    loadComponent: () => import('./pages/solicitudes-insumos-page/solicitudes-insumos-form/solicitudes-insumos-form.component').then(m => m.SolicitudesInsumosFormComponent)
  },

  // ── FE: Facturas Electrónicas ────────────────────────────────────────────
  // Vista 1: Panel de Facturación (listado + KPIs)
  {
    path: 'facturas',
    loadComponent: () => import('./pages/facturas-page/facturas-list/facturas-list.component').then(m => m.FacturasListPageComponent),
  },
  // Vista de Importar Factura
  {
    path: 'facturas/importar',
    loadComponent: () => import('./pages/facturas-page/factura-import/factura-import.component').then(m => m.FacturaImportPageComponent)
  },
  // Vista 5: Detalle Solicitud GIL F-014
  {
    path: 'facturas/gil/:id',
    loadComponent: () => import('./pages/facturas-page/gil-solicitud-detail/gil-solicitud-detail.component').then(m => m.GilSolicitudDetailPageComponent),
  },
  // Vista 3: Detalle de Factura FEL (Bento Grid)
  {
    path: 'facturas/:id',
    loadComponent: () => import('./pages/facturas-page/factura-detail/factura-detail.component').then(m => m.FacturaDetailPageComponent)
  },
  // Vista 4: Editar Factura FEL (Editable/Lectura antigua)
  {
    path: 'facturas/:id/editar',
    loadComponent: () => import('./pages/facturas-page/factura-edit/factura-edit.component').then(m => m.FacturaEditPageComponent),
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

  // ── Actas de Legalización ───────────────────────────────────────────────────
  {
    path: 'actas',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/actas-page/actas-list/actas-list.component').then(
            m => m.ActasListComponent
          ),
      },
      {
        path: 'nueva',
        loadComponent: () =>
          import('./pages/actas-page/actas-create/actas-create.component').then(
            m => m.ActasCreateComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/actas-page/actas-detail/actas-detail.component').then(
            m => m.ActasDetailComponent
          ),
        children: [
          {
            path: 'cargar-firma',
            loadComponent: () =>
              import('./pages/actas-page/actas-upload/actas-upload.component').then(
                m => m.ActasUploadComponent
              ),
          },
        ],
      },
    ]
  },

  // ── Paquete Probatorio ──────────────────────────────────────────────────
  {
    path: 'paquete-probatorio',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/paquete-probatorio-page/paquete-list/paquete-list.component').then(
            m => m.PaqueteListComponent
          ),
      },
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/paquete-probatorio-page/paquete-create/paquete-create.component').then(
            m => m.PaqueteCreateComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/paquete-probatorio-page/paquete-detail/paquete-detail.component').then(
            m => m.PaqueteDetailComponent
          ),
        children: [
          {
            path: 'adjuntar',
            loadComponent: () =>
              import('./pages/paquete-probatorio-page/paquete-upload/paquete-upload.component').then(
                m => m.PaqueteUploadComponent
              ),
          },
          {
            path: 'requisicion',
            loadComponent: () =>
              import('./pages/paquete-probatorio-page/paquete-req-detail/paquete-req-detail.component').then(
                m => m.PaqueteReqDetailComponent
              ),
          },
        ],
      },
    ],
  },

  // ── Requisiciones (Formato 45-S) ────────────────────────────────────────
  {
    path: 'requisiciones',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/requisiciones-page/requisiciones-dashboard/requisiciones-dashboard.component').then(
            m => m.RequisicionesDashboardComponent
          ),
        children: [
          {
            path: 'detalle/:id',
            loadComponent: () =>
              import('./pages/requisiciones-page/requisiciones-detalle/requisiciones-detalle.component').then(
                m => m.RequisicionesDetalleComponent
              ),
          },
          {
            path: 'despacho/:id',
            loadComponent: () =>
              import('./pages/requisiciones-page/requisiciones-despacho/requisiciones-despacho.component').then(
                m => m.RequisicionesDespachoComponent
              ),
          },
        ]
      },
      {
        path: 'nueva',
        loadComponent: () =>
          import('./pages/requisiciones-page/requisiciones-create/requisiciones-create.component').then(
            m => m.RequisicionesCreateComponent
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
    ],
  },
];
