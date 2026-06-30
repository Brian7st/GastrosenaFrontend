import { Routes } from '@angular/router';
import { CocinaPageComponent } from './ui/cocina-page.component';
import { sharedRoleGuard } from '@restaurant/shared/auth';
import { Rol } from '@restaurant/shared/models';

export const COCINA_ROUTES: Routes = [
  {
    path: '',
    component: CocinaPageComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', loadComponent: () => import('./pages/inicio-page/inicio-page.component').then(m => m.InicioPageComponent) },
      { path: 'comandas', loadComponent: () => import('./pages/comandas-page/comandas-page.component').then(m => m.ComandasPageComponent) },
      { path: 'recetas', loadComponent: () => import('./pages/recetas-page/recetas-page.component').then(m => m.RecetasPageComponent) },
      {
        path: 'actividad',
        loadComponent: () => import('./pages/actividad-page/actividad-page.component').then(m => m.ActividadPageComponent),
        canActivate: [sharedRoleGuard([Rol.ADMINISTRADOR, Rol.CHEF])]
      },
      {
        path: 'evaluacion-masiva',
        loadComponent: () => import('./pages/evaluacion-masiva-page/evaluacion-masiva-page.component').then(m => m.EvaluacionMasivaPageComponent),
        canActivate: [sharedRoleGuard([Rol.ADMINISTRADOR, Rol.CHEF])]
      },
      {
        path: 'evaluacion-individual',
        loadComponent: () => import('./pages/evaluacion-individual-page/evaluacion-individual-page.component').then(m => m.EvaluacionIndividualPageComponent),
        canActivate: [sharedRoleGuard([Rol.ADMINISTRADOR, Rol.CHEF])]
      },
      { path: 'estadisticas', loadComponent: () => import('./pages/estadisticas-page/estadisticas-page.component').then(m => m.EstadisticasPageComponent) },
      {
        path: 'actividades',
        loadComponent: () => import('./pages/actividades-list-page/actividades-list-page.component').then(m => m.ActividadesListPageComponent),
        canActivate: [sharedRoleGuard([Rol.ADMINISTRADOR, Rol.CHEF])]
      }
    ]
  },
];
