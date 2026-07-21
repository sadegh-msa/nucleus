import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiRipple, UiSvgIcon } from '@nucleus/ui';
import { PanelBreadcrumb as PanelBreadcrumbService } from '../../services';

@Component({
  selector: 'nu-panel-breadcrumb',
  templateUrl: './panel-breadcrumb.html',
  styleUrl: './panel-breadcrumb.scss',
  imports: [UiSvgIcon, UiRipple, RouterLink],
})
export class PanelBreadcrumbComponent {
  readonly #breadcrumb = inject(PanelBreadcrumbService);

  readonly items = this.#breadcrumb.items;
}
