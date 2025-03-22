import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideNuCommon } from '@nucleus/common';
import { AuthOnRunEffect, provideNuAuth, provideNuLayout, signOutMetaReducer } from '@nucleus/core';
import { provideFabric } from '@nucleus/fabric';
import Aura from '@primeng/themes/aura';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { environment } from '../environments/environment';
import { appIcons } from './app.icons';
import { appRoutes } from './app.routes';
import { navMenuItems } from './nav-menu-items';
import { appEffects } from './store/app.effects';
import { appReducers } from './store/app.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideEffects(appEffects),
    provideStore(appReducers, { metaReducers: [signOutMetaReducer] }),
    provideNuCommon({ rest: environment.rest }),
    provideFabric({ ui: environment.ui, icons: appIcons }),
    provideNuAuth({
      rest: environment.rest,
      branding: environment.branding,
      ...environment.auth,
    }),
    provideNuLayout({ branding: environment.branding, navMenuItems }),
    provideAngularSvgIcon(),
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
  ],
};
