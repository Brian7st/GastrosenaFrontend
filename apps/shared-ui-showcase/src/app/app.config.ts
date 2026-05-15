import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRestaurantUi } from '@restaurant/shared/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRestaurantUi(),
  ],
};
