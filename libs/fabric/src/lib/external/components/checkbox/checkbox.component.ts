import { NgClass, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  inject,
  input,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { componentStyleClass } from '../../configs';
import { GenericToggleConsumer, ToggleValue } from '../../models/toggle.model';
import { ToggleService } from '../../services';

type Value = boolean | string | null | undefined;

@Component({
  selector: 'fab-checkbox',
  imports: [FormsModule, NgClass, TitleCasePipe],
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor, GenericToggleConsumer {
  readonly #toggleService = inject(ToggleService);

  @HostBinding('class') styleClass = componentStyleClass.checkbox;

  value = input<ToggleValue>();
  label = input<string>();
  isChecked!: GenericToggleConsumer['isChecked'];
  isDisabled!: GenericToggleConsumer['isDisabled'];
  isBinary!: GenericToggleConsumer['isBinary'];
  hasLabel!: GenericToggleConsumer['hasLabel'];
  toggle!: () => GenericToggleConsumer['toggle'];
  writeValue!: (obj: any) => void;
  registerOnChange!: (fn: any) => void;
  registerOnTouched!: (fn: any) => void;
  setDisabledState!: (isDisabled: boolean) => void;

  constructor() {
    this.#toggleService.init(this);
  }
}
