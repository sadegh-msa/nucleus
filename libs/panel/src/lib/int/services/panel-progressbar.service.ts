import { inject, Service, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter, interval, type Subscription, takeWhile } from 'rxjs';

@Service()
export class PanelProgressbarService {
  readonly #router = inject(Router);

  readonly intervalValue = 200;
  readonly startValue = 0;
  readonly endValue = 100;
  readonly progressStep = 10;
  readonly endDelay = 1500;

  readonly #value = signal(0);
  readonly value = this.#value.asReadonly();

  intervalSub?: Subscription;

  constructor() {
    this.#router.events
      .pipe(filter((v) => v instanceof NavigationStart))
      .subscribe(() => this.startProgress());

    this.#router.events
      .pipe(
        filter((v) => {
          return (
            v instanceof NavigationEnd ||
            v instanceof NavigationCancel ||
            v instanceof NavigationError ||
            v instanceof NavigationSkipped
          );
        }),
      )
      .subscribe(() => this.endProgress());
  }

  startProgress() {
    const topValue = this.endValue - this.endValue / this.progressStep;

    this.intervalSub?.unsubscribe();
    this.#value.set(this.startValue);
    this.intervalSub = interval(this.intervalValue)
      .pipe(takeWhile(() => this.#value() <= topValue))
      .subscribe(() => this.#value.update((v) => v + this.progressStep));
  }

  endProgress() {
    this.intervalSub?.unsubscribe();
    this.#value.set(this.endValue);
    setTimeout(() => this.#value.set(-1), this.endDelay);
  }
}
