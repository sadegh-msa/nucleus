import { AsyncPipe, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { injectNuCommonConfig } from '@nucleus/common';
import { AuthTokenService } from '../../../../ext/auth/services/auth-token.service';

@Component({
  selector: 'nu-sign-layout',
  templateUrl: './sign-layout.component.html',
  imports: [NgOptimizedImage, NgStyle, NgTemplateOutlet, AsyncPipe],
})
export class SignLayoutComponent {
  readonly #authTokenService = inject(AuthTokenService);

  readonly branding = injectNuCommonConfig().branding;
  readonly isUserAuthenticated = this.#authTokenService.isAuthenticated;
}
