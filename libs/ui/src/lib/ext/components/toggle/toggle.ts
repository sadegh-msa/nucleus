import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, forwardRef, inject, input } from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UiToggleValueAccessor } from '../../../int/services';
import type { ToggleValueModel, UiGenericToggleConsumerModel } from '../../models/toggle.model';

@Component({
  selector: 'ui-toggle',
  imports: [FormsModule, NgClass, TitleCasePipe],
  templateUrl: './toggle.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiToggle),
      multi: true,
    },
    UiToggleValueAccessor,
  ],
})
export class UiToggle implements ControlValueAccessor, UiGenericToggleConsumerModel {
  readonly #uiToggleValueAccessor = inject(UiToggleValueAccessor);

  value = input<ToggleValueModel>();
  label = input<string>();
  hasCheckmark = input<boolean>();
  isChecked!: UiGenericToggleConsumerModel['isChecked'];
  isDisabled!: UiGenericToggleConsumerModel['isDisabled'];
  isBinary!: UiGenericToggleConsumerModel['isBinary'];
  hasLabel!: UiGenericToggleConsumerModel['hasLabel'];
  toggle!: () => UiGenericToggleConsumerModel['toggle'];
  writeValue!: (obj: any) => void;
  registerOnChange!: (fn: any) => void;
  registerOnTouched!: (fn: any) => void;
  setDisabledState!: (isDisabled: boolean) => void;

  constructor() {
    this.#uiToggleValueAccessor.init(this);
  }
}
