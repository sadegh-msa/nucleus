import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { createFadeAnimation, OperationStatus, ShowLoadingComponent } from '@nucleus/common';
import { authActions, authSelectors, LayoutComponent } from '@nucleus/core';
import { MenuItem as FabMenuItem, StyleClassDirective } from '@nucleus/fabric';
import { NuPanelService } from '@nucleus/panel';
import { SvgIconComponent } from 'angular-svg-icon';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { appMenuItems } from './app.menu';
import { SampleEventHandlerService } from './pages/sample';
import { AppStates } from './store/app.state';

interface City {
  name: string;
  code: string;
}

@Component({
  imports: [
    RouterModule,
    ToastModule,
    ButtonModule,
    MenuModule,
    DropdownModule,
    FormsModule,
    BadgeModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    NgTemplateOutlet,
    ShowLoadingComponent,
    StyleClassDirective,
    SvgIconComponent,
    LayoutComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ConfirmationService],
  animations: [createFadeAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly #messageService = inject(MessageService);
  readonly #appStore$ = inject(Store<AppStates>);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #sampleEventHandlerService = inject(SampleEventHandlerService);

  readonly isUserAuthenticated = signal(false);
  readonly showLoading = signal(false);
  readonly htmlDir = signal<'ltr' | 'rtl'>('ltr');
  readonly #panelService = inject(NuPanelService);

  userMenuItems: MenuItem[] = [
    {
      label: 'User Profile',
      items: [
        {
          label: 'Sign Out',
          icon: 'pi pi-exit',
          command: () => {
            this.confirmSignOut();
          },
        },
      ],
    },
  ];
  items: MenuItem[] = [
    {
      label: 'Options',
      items: [
        {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: () => {
            this.update();
          },
        },
        {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
            this.delete();
          },
        },
      ],
    },
    {
      label: 'Navigate',
      items: [
        {
          label: 'Angular',
          icon: 'pi pi-external-link',
          url: 'http://angular.io',
        },
        {
          label: 'Router',
          icon: 'pi pi-upload',
          routerLink: '/fileupload',
        },
      ],
    },
  ];
  selectedCity: City | undefined;
  cities: City[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];

  constructor() {
    effect(() => {
      document.dir = this.htmlDir();
    });
  }

  ngOnInit() {
    this.#handleEvents();
    this.#panelService.mainMenu.set(structuredClone(appMenuItems) as FabMenuItem[]);
  }

  #handleEvents() {
    this.#appStore$.pipe(select(authSelectors.check.status)).subscribe((status) => {
      if (status === OperationStatus.Success) {
        this.isUserAuthenticated.set(true);
      } else if (status === OperationStatus.Failure) {
        this.isUserAuthenticated.set(false);
      }
    });

    this.#appStore$.pipe(select(authSelectors.signOut.status)).subscribe((status) => {
      this.showLoading.set(status === OperationStatus.InProgress);
    });

    this.#sampleEventHandlerService.register();
  }

  update() {
    this.#messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Data Updated',
    });
  }

  delete() {
    this.#messageService.add({
      severity: 'warn',
      summary: 'Delete',
      detail: 'Data Deleted',
    });
  }

  signOut() {
    this.#appStore$.dispatch(authActions.signOut());
  }

  confirmSignOut() {
    this.#confirmationService.confirm({
      message: 'Are You sure you want to logout?',
      header: 'Sign Out',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.signOut(),
    });
  }
}
