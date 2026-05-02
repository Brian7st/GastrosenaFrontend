import { Routes } from '@angular/router';
import { BienesListPageComponent } from './ui/pages/bienes-list/bienes-list.component';
import { BienDetailPageComponent } from './ui/pages/bien-detail/bien-detail.component';
import { BienExportPageComponent } from './ui/pages/bien-export/bien-export.component';

export const INVENTARIO_ROUTES: Routes = [
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
];
