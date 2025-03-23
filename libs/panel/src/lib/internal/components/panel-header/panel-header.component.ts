import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  PanelToolbarComponent
} from '../panel-toolbar/panel-toolbar.component';
import { PanelBreadcrumbComponent } from '../panel-breadcrumb/panel-breadcrumb.component';

@Component({
  selector: 'header[nu-panel-header]',
  imports: [PanelToolbarComponent, PanelBreadcrumbComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel-header.component.html',
  styleUrl: './panel-header.component.scss',
})
export class NuPanelHeaderComponent {}
