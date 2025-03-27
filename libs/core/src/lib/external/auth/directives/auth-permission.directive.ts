import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  untracked,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[permission]',
})
export class AuthPermissionDirective {
  readonly #templateRef = inject(TemplateRef<any>);
  readonly #viewContainer = inject(ViewContainerRef);

  permission = input.required<string>();

  constructor() {
    effect(() => {
      const permission = this.permission();

      untracked(() => {
        if (permission) {
          this.#viewContainer.createEmbeddedView(this.#templateRef);
        } else {
          this.#viewContainer.clear();
        }
      });
    });
  }
}
