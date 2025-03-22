import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  LayoutNavComponent
} from 'libs/core/src/lib/layout/components/layout-nav/layout-nav.component';
import {
  LayoutTopbarComponent
} from 'libs/core/src/lib/layout/components/layout-topbar/layout-topbar.component';
import { PrimeTemplate } from 'primeng/api';
import { Card } from 'primeng/card';
import { ProgressBar } from 'primeng/progressbar';
import { LayoutNavMode } from '../../enums/layout.enum';
import { LayoutNavService } from '../../services/layout-nav.service';
import { LayoutProgressbarService } from '../../services/layout-progressbar.service';

@Component({
  selector: 'nu-layout',
  templateUrl: './layout.component.html',
  imports: [ProgressBar, LayoutTopbarComponent, LayoutNavComponent, Card, PrimeTemplate],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #navService = inject(LayoutNavService);
  readonly #progressbarService = inject(LayoutProgressbarService);

  readonly mode = this.#navService.mode.asReadonly();
  readonly progressValue = this.#progressbarService.value;

  @HostBinding('class') styleClass = this.#createStyleClass(this.mode());

  constructor() {
    toObservable(this.#navService.mode)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((mode) => (this.styleClass = this.#createStyleClass(mode)));
  }

  #createStyleClass(mode: LayoutNavMode) {
    return `nu-layout-nav-${mode.toLowerCase()}`;
  }
}
