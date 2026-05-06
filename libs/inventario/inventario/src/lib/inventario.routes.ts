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
    loadComponent: () =>
      import('./pages/solicitudes-page/solicitudes-list/solicitudes-list.component').then(
        m => m.SolicitudesListComponent
      ),
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
];
