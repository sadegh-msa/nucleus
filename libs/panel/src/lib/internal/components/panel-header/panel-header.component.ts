import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'header[nu-panel-header]',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './panel-header.component.html',
    styleUrl: './panel-header.component.scss'
})
export class NuPanelHeaderComponent {}
