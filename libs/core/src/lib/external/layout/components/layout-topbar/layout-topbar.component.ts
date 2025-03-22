import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { Card } from 'primeng/card';
import { LayoutBreadcrumbComponent } from '../layout-breadcrumb/layout-breadcrumb.component';
import { LayoutToolbarComponent } from '../layout-toolbar/layout-toolbar.component';

@Component({
  selector: 'nu-layout-topbar',
  templateUrl: './layout-topbar.component.html',
  imports: [Card, LayoutBreadcrumbComponent, LayoutToolbarComponent, PrimeTemplate],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutTopbarComponent {}
