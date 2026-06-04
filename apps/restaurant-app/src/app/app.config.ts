import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  errorInterceptor,
  jwtInterceptor,
  loadingInterceptor,
  mockSecurityInterceptor,
} from '@restaurant/shared/api';
import { shellRoutes } from '@restaurant/shell';
import { provideRestaurantUi } from '@restaurant/shared/ui';
import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(shellRoutes),
    provideHttpClient(withInterceptors([
      mockSecurityInterceptor,
      jwtInterceptor,
      errorInterceptor,
      loadingInterceptor,
    ])),
    provideStore({}),      // ← store vacío, cada feature se registra en sus rutas
    provideEffects(),      // ← effects base vacío
    provideRestaurantUi(),
    provideMarkdown(),
  ],
};