import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, forwardRef, inject, input } from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { GenericToggleConsumerModel, ToggleValueModel } from '../../models/toggle.model';
import { ToggleValueAccessor } from '../../services/toggle-value-accessor';

@Component({
  selector: 'ui-toggle',
  imports: [FormsModule, NgClass, TitleCasePipe],
  templateUrl: './toggle.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Toggle),
      multi: true,
    },
    ToggleValueAccessor,
  ],
})
export class Toggle implements ControlValueAccessor, GenericToggleConsumerModel {
  readonly #toggleValueAccessor = inject(ToggleValueAccessor);

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
    this.#toggleValueAccessor.init(this);
  }
}
