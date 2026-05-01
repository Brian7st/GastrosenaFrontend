import { Routes } from '@angular/router';
import { BienesListPageComponent } from './ui/pages/bienes-list/bienes-list.component';
import { BienDetailPageComponent } from './ui/pages/bien-detail/bien-detail.component';

export const INVENTARIO_ROUTES: Routes = [
  {
    path: '',
    component: BienesListPageComponent,
  },
  {
    path: 'bienes/:id',
    component: BienDetailPageComponent,
  },
];
