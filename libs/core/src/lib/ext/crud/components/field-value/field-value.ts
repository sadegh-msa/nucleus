import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { DataType } from '@nucleus/common';
import { SvgIconDirective } from '@nucleus/ui';

@Component({
  selector: 'nu-field-value',
  templateUrl: './field-value.html',
  imports: [CurrencyPipe, DatePipe, NgTemplateOutlet, SvgIconDirective],
})
export class FieldValue {
  readonly DataType = DataType;

  value = input.required<any>();
  format = input<string>();
  type = input<DataType>();
}
