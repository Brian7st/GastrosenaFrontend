import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideLucideIcons, lucideLegacyIconMap } from '@lucide/angular';
import { APP_LUCIDE_ICONS } from './core/config/lucide-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideLucideIcons(...Object.values(APP_LUCIDE_ICONS))
  ]
};
