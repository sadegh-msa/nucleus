import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { PanelBreadcrumbService } from '../../services/panel-breadcrumb.service';

@Component({
  selector: 'nu-panel-breadcrumb',
  templateUrl: './panel-breadcrumb.component.html',
  imports: [Breadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelBreadcrumbComponent {
  readonly #breadcrumbService = inject(PanelBreadcrumbService);

  readonly home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  readonly items = computed(() => this.#breadcrumbService.items());
}
