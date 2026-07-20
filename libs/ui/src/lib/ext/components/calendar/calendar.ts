import { Component, effect, forwardRef, signal } from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-calendar',
  imports: [FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Calendar),
      multi: true,
    },
  ],
})
export class Calendar implements ControlValueAccessor {
  value = signal<Date>(new Date());
  isDisabled = signal(false);

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {
    effect(() => this.onChange(this.value()));
  }

  writeValue(value: Date) {
    this.value.set(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }
}
