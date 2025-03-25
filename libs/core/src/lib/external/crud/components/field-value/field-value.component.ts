import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DataType } from '@nucleus/common';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'nu-field-value',
  templateUrl: './field-value.component.html',
  imports: [CurrencyPipe, DatePipe, NgTemplateOutlet, SvgIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldValueComponent {
  readonly DataType = DataType;

  value = input.required<any>();
  format = input<string>();
  type = input<DataType>();
}
