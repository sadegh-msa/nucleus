import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RippleDirective, SvgIconDirective } from '@nucleus/ui';
import { PanelBreadcrumb } from '../../services';

@Component({
  selector: 'nu-panel-breadcrumb',
  templateUrl: './panel-breadcrumb.component.html',
  styleUrl: './panel-breadcrumb.component.scss',
  imports: [SvgIconDirective, RippleDirective, RouterLink],
})
export class PanelBreadcrumbComponent {
  readonly #breadcrumb = inject(PanelBreadcrumb);

  readonly items = this.#breadcrumb.items;
}
