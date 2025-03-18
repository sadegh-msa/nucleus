import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'scr-layout-toolbar',
  templateUrl: './layout-toolbar.component.html',
  imports: [Toolbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutToolbarComponent {}
