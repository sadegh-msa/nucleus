import { Component } from '@angular/core';
import { PanelBreadcrumbComponent } from '../panel-breadcrumb/panel-breadcrumb';
import { PanelToolbar } from '../panel-toolbar/panel-toolbar';

@Component({
  selector: 'header[nu-panel-header]',
  imports: [PanelToolbar, PanelBreadcrumbComponent],
  templateUrl: './panel-header.html',
  styleUrl: './panel-header.scss',
})
export class NuPanelHeader {}
