import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout/public-layout.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@restaurant/home').then(m => m.HOME_ROUTES),
      },
    ],
  },
];
