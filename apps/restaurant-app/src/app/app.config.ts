import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { errorInterceptor, jwtInterceptor, loadingInterceptor } from '@restaurant/shared/api';
import { shellRoutes } from '@restaurant/shell';
import { provideRestaurantUi } from '@restaurant/shared/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(shellRoutes),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor, loadingInterceptor])),
    provideStore(),
    provideRestaurantUi(),
  ],
};
