import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'nu-layout-toolbar',
  templateUrl: './layout-toolbar.component.html',
  imports: [Toolbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutToolbarComponent {}
