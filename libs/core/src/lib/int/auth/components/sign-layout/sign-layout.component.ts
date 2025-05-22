import { AsyncPipe, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NU_COMMON_CONFIG } from '@nucleus/common';
import { CardComponent } from '@nucleus/fabric';
import { AuthTokenService } from '../../../../ext/auth/services/auth-token.service';

@Component({
  selector: 'nu-sign-layout',
  templateUrl: './sign-layout.component.html',
  imports: [NgOptimizedImage, NgStyle, NgTemplateOutlet, CardComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignLayoutComponent {
  readonly #authTokenService = inject(AuthTokenService);
  readonly #nuCommonConfig = inject(NU_COMMON_CONFIG);

  readonly branding = this.#nuCommonConfig.branding;
  readonly isUserAuthenticated = this.#authTokenService.isAuthenticated;
}
