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
];
