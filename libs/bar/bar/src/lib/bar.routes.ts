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
        path: 'evaluacion-masiva',
        loadComponent: () => import('./pages/evaluacion-masiva-page/evaluacion-masiva-page.component').then((m) => m.EvaluacionMasivaPageComponent)
      },
      {
        path: 'evaluacion-individual',
        loadComponent: () => import('./pages/evaluacion-individual-page/evaluacion-individual-page.component').then((m) => m.EvaluacionIndividualPageComponent)
      },
      {
        path: 'actividad',
        loadComponent: () => import('./pages/actividad-page/actividad-page.component').then((m) => m.ActividadPageComponent)
      },
      {
        path: 'actividades',
        loadComponent: () => import('./pages/actividades-list-page/actividades-list-page.component').then((m) => m.ActividadesListPageComponent)
      }
    ]
  }
];
