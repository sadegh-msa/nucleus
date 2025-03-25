import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenericToggleConsumer, ToggleValue } from '../../models/toggle.model';
import { ToggleService } from '../../services';

@Component({
  selector: 'fab-toggle',
  imports: [FormsModule, NgClass, TitleCasePipe],
  templateUrl: './toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
    ToggleService,
  ],
})
export class ToggleComponent implements ControlValueAccessor, GenericToggleConsumer {
  readonly #toggleService = inject(ToggleService);

  value = input<ToggleValue>();
  label = input<string>();
  hasCheckmark = input<boolean>();
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
