import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, forwardRef, inject, input } from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { GenericToggleConsumerModel, ToggleValueModel } from '../../models/toggle.model';
import { ToggleService } from '../../services';

@Component({
  selector: 'ui-toggle',
  imports: [FormsModule, NgClass, TitleCasePipe],
  templateUrl: './toggle.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
    ToggleService,
  ],
})
export class ToggleComponent implements ControlValueAccessor, GenericToggleConsumerModel {
  readonly #toggleService = inject(ToggleService);

  value = input<ToggleValueModel>();
  label = input<string>();
  hasCheckmark = input<boolean>();
  isChecked!: GenericToggleConsumerModel['isChecked'];
  isDisabled!: GenericToggleConsumerModel['isDisabled'];
  isBinary!: GenericToggleConsumerModel['isBinary'];
  hasLabel!: GenericToggleConsumerModel['hasLabel'];
  toggle!: () => GenericToggleConsumerModel['toggle'];
  writeValue!: (obj: any) => void;
  registerOnChange!: (fn: any) => void;
  registerOnTouched!: (fn: any) => void;
  setDisabledState!: (isDisabled: boolean) => void;

  constructor() {
    this.#toggleService.init(this);
  }
}
