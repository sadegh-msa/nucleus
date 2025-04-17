import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'nu-panel-toolbar',
  templateUrl: './panel-toolbar.component.html',
  imports: [Toolbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelToolbarComponent {}
