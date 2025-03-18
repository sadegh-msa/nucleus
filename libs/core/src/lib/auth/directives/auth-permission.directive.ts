import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({

  selector: '[permission]'
})
export class AuthPermissionDirective {
  readonly #templateRef = inject(TemplateRef<any>);
  readonly #viewContainer = inject(ViewContainerRef);

  @Input() set permission(permissions: string) {
    if (permissions) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    }
  }
}
