import { AsyncPipe, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { injectNuCommonConfig } from '@nucleus/common';
import { AuthToken } from '../../../../ext/auth/services/auth-token';

@Component({
  selector: 'nu-sign-layout',
  templateUrl: './sign-layout.html',
  imports: [NgOptimizedImage, NgStyle, NgTemplateOutlet, AsyncPipe],
})
export class SignLayout {
  readonly #authToken = inject(AuthToken);

  readonly branding = injectNuCommonConfig().branding;
  readonly isUserAuthenticated = this.#authToken.isAuthenticated;
}
