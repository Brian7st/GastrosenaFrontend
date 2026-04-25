import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },

  // Gestión de Bienes
  { path: 'bienes', loadComponent: () => import('./features/bienes/bienes-list/bienes-list.component').then(m => m.BienesListComponent) },
  { path: 'bienes/exportar', loadComponent: () => import('./features/bienes/bienes-export/bienes-export.component').then(m => m.BienesExportComponent) },
  { path: 'bienes/importar', loadComponent: () => import('./features/bienes/bienes-import/bienes-import.component').then(m => m.BienesImportComponent) },
  { path: 'bienes/:id', loadComponent: () => import('./features/bienes/bienes-detail/bienes-detail.component').then(m => m.BienesDetailComponent) },
  { path: 'bienes/:id/editar', loadComponent: () => import('./features/bienes/bienes-edit/bienes-edit.component').then(m => m.BienesEditComponent) },
  
  // Facturas Electrónicas (FEL)
  { path: 'facturas', loadComponent: () => import('./features/facturas/facturas-list/facturas-list.component').then(m => m.FacturasListComponent) },
  { path: 'facturas/:id', loadComponent: () => import('./features/facturas/facturas-detail/facturas-detail.component').then(m => m.FacturasDetailComponent) },
  { path: 'facturas/:id/anular', loadComponent: () => import('./features/facturas/facturas-anular/facturas-anular.component').then(m => m.FacturasAnularComponent) },

  // Formato GIL-F-014 (Solicitudes de Bienes)
  { path: 'solicitudes-gil', loadComponent: () => import('./features/solicitudes-gil/solicitudes-gil-list/solicitudes-gil-list.component').then(m => m.SolicitudesGilListComponent) },
  { path: 'solicitudes-gil/nueva', loadComponent: () => import('./features/solicitudes-gil/solicitudes-gil-create/solicitudes-gil-create.component').then(m => m.SolicitudesGilCreateComponent) },
  { path: 'solicitudes-gil/:id', loadComponent: () => import('./features/solicitudes-gil/solicitudes-gil-detail/solicitudes-gil-detail.component').then(m => m.SolicitudesGilDetailComponent) },
  { path: 'solicitudes-gil/:id/editar', loadComponent: () => import('./features/solicitudes-gil/solicitudes-gil-edit/solicitudes-gil-edit.component').then(m => m.SolicitudesGilEditComponent) },
  { path: 'solicitudes-gil/:id/pdf', loadComponent: () => import('./features/solicitudes-gil/solicitudes-gil-pdf/solicitudes-gil-pdf.component').then(m => m.SolicitudesGilPdfComponent) },

  // Consolidado Presupuestal (factura-global)
  { path: 'factura-global', loadComponent: () => import('./features/conciliacion/conciliacion-list/conciliacion-list.component').then(m => m.ConciliacionListComponent) },
  { path: 'factura-global/nuevo', loadComponent: () => import('./features/conciliacion/conciliacion-create/conciliacion-create.component').then(m => m.ConciliacionCreateComponent) },
  { path: 'factura-global/:id', loadComponent: () => import('./features/conciliacion/conciliacion-detail/conciliacion-detail.component').then(m => m.ConciliacionDetailComponent) },

  // Alertas de Stock
  { path: 'alertas', loadComponent: () => import('./features/alertas-stock/alertas-stock.component').then(m => m.AlertasStockComponent) },

  // Presupuesto
  { path: 'presupuesto', loadComponent: () => import('./features/presupuesto/presupuesto-dashboard/presupuesto-dashboard.component').then(m => m.PresupuestoDashboardComponent) },
  { path: 'presupuesto/:id', loadComponent: () => import('./features/presupuesto/presupuesto-detail/presupuesto-detail.component').then(m => m.PresupuestoDetailComponent) },
];
