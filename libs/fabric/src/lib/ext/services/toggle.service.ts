import {
  ChangeDetectorRef,
  computed,
  effect,
  Injectable,
  inject,
  signal,
} from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import type { GenericToggleConsumer, ToggleValue } from '../models/toggle.model';

@Injectable()
export class ToggleService {
  #changeDetectorRef = inject(ChangeDetectorRef);

  #consumer!: GenericToggleConsumer;

  #onChange: any = () => {};
  #onTouch: any = () => {};

  constructor() {
    effect(() => {
      if (this.#consumer.isDisabled()) {
        return;
      }

      const value = this.#consumer.isBinary()
        ? this.#consumer.isChecked()
        : this.#consumer.isChecked()
          ? this.#consumer.value()
          : undefined;

      this.#onChange(value);
      this.#changeDetectorRef.markForCheck();
    });
  }

  init(consumer: ControlValueAccessor & GenericToggleConsumer) {
    consumer.isChecked = signal(false);
    consumer.isDisabled = signal(false);
    consumer.isBinary = computed(() => consumer.value() === undefined);
    consumer.hasLabel = computed(() => !!consumer.label() || !!consumer.value());
    consumer.toggle = this.toggle.bind(this);
    consumer.writeValue = this.#writeValue.bind(this);
    consumer.registerOnChange = this.#registerOnChange.bind(this);
    consumer.registerOnTouched = this.#registerOnTouched.bind(this);
    consumer.setDisabledState = this.#setDisabledState.bind(this);

    this.#consumer = consumer;
  }

  #writeValue(value: ToggleValue) {
    this.#consumer.isChecked.set(
      this.#consumer.isBinary() ? !!value : value === this.#consumer.value(),
    );
  }

  #registerOnChange(fn: any) {
    this.#onChange = fn;
  }

  #registerOnTouched(fn: any) {
    this.#onTouch = fn;
  }

  #setDisabledState(isDisabled: boolean) {
    this.#consumer.isDisabled.set(isDisabled);
  }

  toggle() {
    if (this.#consumer.isDisabled()) {
      return;
    }

    this.#consumer.isChecked.set(!this.#consumer.isChecked());
  }
}
