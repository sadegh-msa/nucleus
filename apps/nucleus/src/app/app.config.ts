import { provideHttpClient } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { type NuCommonConfigModel, provideNuCommon } from '@nucleus/common';
import { provideAuth, provideAuthStore } from '@nucleus/core';
import { provideNuL10n } from '@nucleus/l10n';
import { provideUi } from '@nucleus/ui';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    provideNuCommon({
      api: environment.api,
      branding: environment.branding,
      crypto: environment.crypto as NuCommonConfigModel['crypto'],
      links: environment.links,
    }),
    provideNuL10n({ languages: environment.languages }),
    provideUi(environment.ui),
    provideAuth({ ...environment.auth }),
    provideAuthStore(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    provideAnimationsAsync(),
  ],
};
