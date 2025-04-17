import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[fabTemplate]',

})
export class TemplateDirective {
  readonly #templateRef = inject(TemplateRef);

  fabTemplate = input.required<string>();

  get name() {
    return this.fabTemplate();
  }

  get ref() {
    return this.#templateRef;
  }
}
