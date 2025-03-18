import { ChangeDetectorRef, Directive, effect, HostBinding, inject, input } from '@angular/core';
import { componentStyleClass } from '../../configs';

@Directive({
  selector: '[fabStyleClass]',

})
export class StyleClassDirective {
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  fabStyleClass = input.required<keyof typeof componentStyleClass>();

  @HostBinding('class') styleClass: string[] = [];

  constructor() {
    effect(() => {
      this.styleClass = componentStyleClass[this.fabStyleClass()];
      this.#changeDetectorRef.markForCheck();
    });
  }
}
