import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DataType } from '../../../common';

@Component({

  selector: 'scr-field-value',
  templateUrl: './field-value.component.html',
  imports: [
    CurrencyPipe,
    DatePipe,
    NgTemplateOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldValueComponent {
  readonly DataType = DataType;

  value = input.required<any>();
  format = input<string>();
  type = input<DataType>();
}
