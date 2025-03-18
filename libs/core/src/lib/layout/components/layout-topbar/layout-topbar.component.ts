import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LayoutBreadcrumbComponent
} from 'libs/core/src/lib/layout/components/layout-breadcrumb/layout-breadcrumb.component';
import {
  LayoutToolbarComponent
} from 'libs/core/src/lib/layout/components/layout-toolbar/layout-toolbar.component';
import { PrimeTemplate } from 'primeng/api';
import { Card } from 'primeng/card';

@Component({
  selector: 'scr-layout-topbar',
  templateUrl: './layout-topbar.component.html',
  imports: [Card, LayoutBreadcrumbComponent, LayoutToolbarComponent, PrimeTemplate],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutTopbarComponent {}
