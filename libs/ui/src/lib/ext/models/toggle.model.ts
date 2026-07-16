import type { InputSignal, Signal, WritableSignal } from '@angular/core';

export type ToggleValue = boolean | string | null | undefined;

export interface GenericToggleConsumer {
  value: InputSignal<ToggleValue>;
  label: InputSignal<string | undefined>;
  isChecked: WritableSignal<boolean>;
  isDisabled: WritableSignal<boolean>;
  isBinary: Signal<boolean>;
  hasLabel: Signal<boolean>;
  toggle: () => void;
}
