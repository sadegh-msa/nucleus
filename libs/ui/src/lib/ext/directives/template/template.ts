import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uiTemplate]',
})
export class UiTemplate {
  readonly #templateRef = inject(TemplateRef);

  uiTemplate = input.required<string>();

  get name() {
    return this.uiTemplate();
  }

  get ref() {
    return this.#templateRef;
  }
}
