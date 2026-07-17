import { Component, input } from '@angular/core';
import type { InfoFieldModel } from '../../models/info.model';
import { FieldValueComponent } from '../field-value/field-value.component';

@Component({
  selector: 'nu-info-fields',
  templateUrl: './info-fields.component.html',
  imports: [FieldValueComponent],
})
export class InfoFieldsComponent {
  infoFields = input.required<InfoFieldModel[][]>();
  data = input.required<any>();
}
