import { Routes } from '@angular/router';
import { BarPageComponent } from './ui/bar-page.component';

export const BAR_ROUTES: Routes = [
  {
    path: '',
    component: BarPageComponent,
  },
  {
    path: 'comandas',
    loadComponent: () => import('./pages/comandas-page/comandas-page.component').then((m) => m.ComandasComponent)
  },
  {
    path: 'recetas',
    loadComponent: () => import('./pages/recetas-page/recetas-page.component').then((m) => m.RecetasPageComponent)
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu-page/menu-page.component').then((m) => m.MenuPageComponent)
  }
];
