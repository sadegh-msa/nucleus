import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { SvgIconDirective } from '@nucleus/fabric';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { infoFieldsDefault } from '../../defaults/info-fields.default';
import { GenericToolbarComponent, type InfoField } from '../../index';
import type { NuToolbar } from '../../models/toolbar.model';
import { InfoFieldsComponent } from '../info-fields/info-fields.component';

@Component({
  selector: 'nu-generic-form-toolbar',
  templateUrl: './generic-form-toolbar.component.html',
  imports: [
    GenericToolbarComponent,
    InfoFieldsComponent,
    KeyValuePipe,
    OverlayPanelModule,
    SvgIconDirective,
  ],
})
export class GenericFormToolbarComponent {
  infoFields = input<InfoField[][]>(infoFieldsDefault);
  data = input<any>(null);
  toolbar = input.required<NuToolbar>();
}
