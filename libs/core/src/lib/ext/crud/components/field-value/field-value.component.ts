import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { DataType } from '@nucleus/common';
import { SvgIconDirective } from '@nucleus/fabric';

@Component({
  selector: 'nu-field-value',
  templateUrl: './field-value.component.html',
  imports: [CurrencyPipe, DatePipe, NgTemplateOutlet, SvgIconDirective],
})
export class FieldValueComponent {
  readonly DataType = DataType;

  value = input.required<any>();
  format = input<string>();
  type = input<DataType>();
}
