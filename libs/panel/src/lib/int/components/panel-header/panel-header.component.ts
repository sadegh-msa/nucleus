import { Component } from '@angular/core';
import { PanelBreadcrumbComponent } from '../panel-breadcrumb/panel-breadcrumb.component';
import { PanelToolbarComponent } from '../panel-toolbar/panel-toolbar.component';

@Component({
  selector: 'header[nu-panel-header]',
  imports: [PanelToolbarComponent, PanelBreadcrumbComponent],
  templateUrl: './panel-header.component.html',
  styleUrl: './panel-header.component.scss',
})
export class NuPanelHeaderComponent {}
