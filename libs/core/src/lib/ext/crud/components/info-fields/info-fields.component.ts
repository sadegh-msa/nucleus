import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { InfoField } from '../../models/info.model';
import { FieldValueComponent } from '../field-value/field-value.component';

@Component({
  selector: 'nu-info-fields',
  templateUrl: './info-fields.component.html',
  imports: [FieldValueComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoFieldsComponent {
  infoFields = input.required<InfoField[][]>();
  data = input.required<any>();
}
