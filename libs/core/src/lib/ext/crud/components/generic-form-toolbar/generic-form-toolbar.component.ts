import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { SvgIconDirective } from '@nucleus/ui';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { GenericToolbarComponent } from '../../components/generic-toolbar/generic-toolbar.component'; // Possibility of circular dependency
import { infoFieldsDefault } from '../../defaults/info-fields.default';
import type { InfoFieldModel } from '../../models/info.model';
import type { NuToolbarModel } from '../../models/toolbar.model';
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
  infoFields = input<InfoFieldModel[][]>(infoFieldsDefault);
  data = input<any>(null);
  toolbar = input.required<NuToolbarModel>();
}
