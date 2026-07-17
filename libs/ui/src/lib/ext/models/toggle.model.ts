import type { InputSignal, Signal, WritableSignal } from '@angular/core';

export type ToggleValueModel = boolean | string | null | undefined;

export interface GenericToggleConsumerModel {
  value: InputSignal<ToggleValueModel>;
  label: InputSignal<string | undefined>;
  isChecked: WritableSignal<boolean>;
  isDisabled: WritableSignal<boolean>;
  isBinary: Signal<boolean>;
  hasLabel: Signal<boolean>;
  toggle: () => void;
}
