import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RippleDirective, SvgIconDirective } from '@nucleus/fabric';
import { PanelBreadcrumbService } from '../../services';

@Component({
  selector: 'nu-panel-breadcrumb',
  templateUrl: './panel-breadcrumb.component.html',
  styleUrl: './panel-breadcrumb.component.scss',
  imports: [SvgIconDirective, RippleDirective, RouterLink],
})
export class PanelBreadcrumbComponent {
  readonly #breadcrumbService = inject(PanelBreadcrumbService);

  readonly items = this.#breadcrumbService.items;
}
