import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { infoFieldsDefault } from '../../defaults/info-fields.default';
import { GenericToolbarComponent } from '../../index';
import { NuToolbar } from '../../models/toolbar.model';
import { InfoFieldsComponent } from '../info-fields/info-fields.component';

@Component({
  selector: 'nu-generic-form-toolbar',
  templateUrl: './generic-form-toolbar.component.html',
  imports: [
    GenericToolbarComponent,
    InfoFieldsComponent,
    KeyValuePipe,
    OverlayPanelModule,
    SvgIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFormToolbarComponent {
  @Input() infoFields = infoFieldsDefault;
  data = input<any>(null);
  toolbar = input.required<NuToolbar>();
}
