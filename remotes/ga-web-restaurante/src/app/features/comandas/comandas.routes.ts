import { Routes } from '@angular/router';
import { ComandasComponent } from './comandas.component';
import { ComandasPageComponent } from './pages/comandas-page/comandas-page.component';

export const COMANDAS_ROUTES: Routes = [
  {
    path: '',
    component: ComandasComponent,
    children: [
      {
        path: '',
        component: ComandasPageComponent
      }
    ]
  }
];
