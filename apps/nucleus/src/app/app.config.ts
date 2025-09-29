import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  type ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { type NuCommonConfig, provideNuCommon } from '@nucleus/common';
import { AuthOnRunEffect, provideNuAuth, signOutMetaReducer } from '@nucleus/core';
import { provideFabric } from '@nucleus/fabric';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { provideNuL10n } from '../../../../libs/l10n/src/lib/ext/providers/l10n.provider';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { appEffects } from './store/app.effects';
import { appReducers } from './store/app.reducers';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideEffects(appEffects),
    provideStore(appReducers, { metaReducers: [signOutMetaReducer] }),
    provideNuCommon({
      api: environment.api,
      branding: environment.branding,
      crypto: environment.crypto as NuCommonConfig['crypto'],
      links: environment.links,
    }),
    provideNuL10n({ languages: environment.languages }),
    provideFabric(environment.ui),
    provideNuAuth({ ...environment.auth }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    MessageService,
    AuthOnRunEffect,
    provideAnimationsAsync()
  ],
};
