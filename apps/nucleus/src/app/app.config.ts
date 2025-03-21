import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, RouterModule } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import {
  AuthModule,
  AuthOnRunEffect,
  LayoutModule,
  ScrCommonModule,
  signOutMetaReducer,
} from '@nucleus/core';
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
    provideHttpClient(),
    provideAngularSvgIcon(),
    provideEffects(appEffects),
    provideStore(appReducers, { metaReducers: [signOutMetaReducer] }),
    provideFabric({ ui: environment.ui, icons: appIcons }),
    importProvidersFrom(RouterModule.forRoot(appRoutes, { bindToComponentInputs: true })),
    importProvidersFrom(ScrCommonModule.forRoot({ rest: environment.rest })),
    importProvidersFrom(LayoutModule.forRoot({ branding: environment.branding, navMenuItems })),
    importProvidersFrom(
      AuthModule.forRoot({
        rest: environment.rest,
        branding: environment.branding,
        ...environment.auth,
      }),
    ),
    MessageService,
    AuthOnRunEffect,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideAngularSvgIcon(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
  ],
};
