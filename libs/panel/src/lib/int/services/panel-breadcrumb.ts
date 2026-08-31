import { inject, Service, signal } from '@angular/core';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { isUUID } from '@nucleus/common';
import type { RouterStateModel } from '@nucleus/crud';
import type { UiMenuItemModel } from '@nucleus/ui';
import { filter, map } from 'rxjs';

const proxiedFns = new WeakSet<(...args: never) => unknown>();

@Service()
export class PanelBreadcrumb {
  readonly #router = inject(Router);

  readonly #items = signal<UiMenuItemModel[]>([]);
  readonly items = this.#items.asReadonly();

  constructor() {
    this.#update(location.pathname);
    this.#handleEvents();
  }

  #handleEvents() {
    if (!proxiedFns.has(window.history.replaceState)) {
      const original = window.history.replaceState;
      const proxied = new Proxy(original, {
        apply: (
          target,
          thisArg,
          argArray: [data: any, unused: string, url?: string | URL | null],
        ) => {
          const oldTitle = window.history.state?.title;
          const newTitle = argArray[0]?.title;

          if (newTitle && oldTitle !== newTitle) {
            this.setTitle(newTitle);
          }

          return Reflect.apply(target, thisArg, argArray);
        },
      });
      proxiedFns.add(proxied);
      window.history.replaceState = proxied;
    }
    const routeObserver = (route: NavigationEnd) => {
      this.#update(route.urlAfterRedirects, this.#router.currentNavigation()?.extras.state);
    };

    this.#router.events
      .pipe(
        filter((v) => v instanceof Scroll),
        map((v) => (v as Scroll).routerEvent as NavigationEnd),
        filter((r) => r.url === '/'),
      )
      .subscribe(routeObserver);

    this.#router.events
      .pipe(
        filter((v) => v instanceof NavigationEnd),
        map((v) => v as NavigationEnd),
      )
      .subscribe(routeObserver);
  }

  #update(routeUrl: string, routeState?: RouterStateModel) {
    const url = new URL(routeUrl, location.origin);
    const urlSegments = url.pathname.split('/').filter((v) => v?.length);

    if (!urlSegments.length) {
      return;
    }

    const hasId = isUUID(urlSegments[urlSegments.length - 1]);
    const labels = urlSegments.slice(0, urlSegments.length - (hasId ? 1 : 0)).map((v) =>
      v
        .toLowerCase()
        .replace(/(?:^|\s|\/|-)\w/g, (match) => match.toUpperCase())
        .replaceAll('-', ' '),
    );
    const items = [];

    for (let i = 0; i < urlSegments.length; i++) {
      const sectionUrl = urlSegments.slice(0, i + 1).join('/');
      const action = urlSegments[i];
      const routerLink = !(['edit', 'view'].includes(action) || routeUrl.endsWith(sectionUrl))
        ? sectionUrl
        : '';
      let label = labels[i];

      if (i === urlSegments.length - 1 && hasId) {
        label = routeState?.title ?? '...';
      }

      items.push({ label, routerLink });

      if (i === urlSegments.length - 1 && action === 'add') {
        const entity = urlSegments[0];
        const entityTitle = entity.charAt(0).toUpperCase() + entity.substring(1).toLowerCase();
        items.push({ label: `<New ${entityTitle}>` });
      }
    }

    this.#items.set(items);
  }

  setTitle(title: string) {
    if (!title) {
      return;
    }

    this.#items.update((items) => {
      items[items.length - 1].label = title;
      return [...items];
    });
  }
}
