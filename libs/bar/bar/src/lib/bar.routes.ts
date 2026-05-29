import { Routes } from '@angular/router';
import { BarPageComponent } from './ui/bar-page.component';

export const BAR_ROUTES: Routes = [
  {
    path: '',
    component: BarPageComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio-page/inicio-page.component').then((m) => m.InicioPageComponent)
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
      },
      {
        path: 'estadisticas',
        loadComponent: () => import('./pages/estadisticas-page/estadisticas-page.component').then((m) => m.EstadisticasPageComponent)
      }
    ]
  }
];
