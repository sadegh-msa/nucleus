import { Component, input } from '@angular/core';
import type { InfoFieldModel } from '../../models/info.model';
import { FieldValue } from '../field-value/field-value';

@Component({
  selector: 'nu-info-fields',
  templateUrl: './info-fields.html',
  imports: [FieldValue],
})
export class InfoFields {
  infoFields = input.required<InfoFieldModel[][]>();
  data = input.required<any>();
}
