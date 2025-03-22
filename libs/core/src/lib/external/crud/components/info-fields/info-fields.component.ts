import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { InfoField } from '../../models/info.model';
import { FieldValueComponent } from '../field-value/field-value.component';

@Component({

  selector: 'nu-info-fields',
  templateUrl: './info-fields.component.html',
  imports: [
    FieldValueComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoFieldsComponent {
  @Input({ required: true }) infoFields: InfoField[][] = [];
  data = input.required<any>();
}
