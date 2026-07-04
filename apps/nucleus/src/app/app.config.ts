import { provideHttpClient } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { type NuCommonConfig, provideNuCommon } from '@nucleus/common';
import { AuthOnRunEffect, provideNuAuth, signOutMetaReducer } from '@nucleus/core';
import { provideFabric } from '@nucleus/fabric';
import { provideNuL10n } from '@nucleus/l10n';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { appEffects } from './store/app.effects';
import { appReducers } from './store/app.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    provideEffects(appEffects),
    provideStore(appReducers, { metaReducers: [signOutMetaReducer] }),
    provideNuCommon({
      api: environment.api,
      branding: environment.branding,
      crypto: environment.crypto as NuCommonConfig['crypto'],
      links: environment.links
    }),
    provideNuL10n({ languages: environment.languages }),
    provideFabric(environment.ui),
    provideNuAuth({ ...environment.auth }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark'
        }
      }
    }),
    AuthOnRunEffect,
    provideAnimationsAsync()
  ]
};
