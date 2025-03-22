import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { LayoutBreadcrumbService } from '../../services/layout-breadcrumb.service';

@Component({
  selector: 'nu-layout-breadcrumb',
  templateUrl: './layout-breadcrumb.component.html',
  imports: [Breadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutBreadcrumbComponent {
  readonly #breadcrumbService = inject(LayoutBreadcrumbService);

  readonly home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  readonly items = computed(() => this.#breadcrumbService.items());
}
