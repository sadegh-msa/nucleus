import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { UiSvgIcon } from '@nucleus/ui';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { GenericToolbar } from '../../components/generic-toolbar/generic-toolbar'; // Possibility of circular dependency
import { infoFieldsDefault } from '../../defaults/info-fields.default';
import type { InfoFieldModel } from '../../models/info.model';
import type { ToolbarModel } from '../../models/toolbar.model';
import { InfoFields } from '../info-fields/info-fields';

@Component({
  selector: 'nu-generic-form-toolbar',
  templateUrl: './generic-form-toolbar.html',
  imports: [GenericToolbar, InfoFields, KeyValuePipe, OverlayPanelModule, UiSvgIcon],
})
export class GenericFormToolbar {
  infoFields = input<InfoFieldModel[][]>(infoFieldsDefault);
  data = input<any>(null);
  toolbar = input.required<ToolbarModel>();
}
