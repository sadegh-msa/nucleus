import { NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardComponent } from '@nucleus/fabric';
import { SCR_AUTH_CONFIG } from '../../providers/auth-config.provider';
import { AuthTokenService } from '../../services/auth-token.service';

@Component({

  selector: 'scr-sign-layout',
  templateUrl: './sign-layout.component.html',
  imports: [
    NgOptimizedImage,
    NgStyle,
    NgTemplateOutlet,
    CardComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignLayoutComponent {
  readonly #authTokenService = inject(AuthTokenService);
  readonly #authConfig = inject(SCR_AUTH_CONFIG);

  readonly branding = this.#authConfig.branding;
  readonly isUserAuthenticated = this.#authTokenService.isUserAuthenticated;
}
