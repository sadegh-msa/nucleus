import { Component, computed, effect, input } from '@angular/core';
import type { FieldState } from '@angular/forms/signals';
import { UiTooltip } from '../../directives';
import type { UiPlacement } from '../../types';

@Component({
  selector: 'ui-form-field',
  templateUrl: './form-field.html',
  imports: [UiTooltip],
  host: {
    '[class]': 'styleClass()',
  },
})
export class UiFormField {
  inputId = input('');
  label = input<string>();
  help = input<string>();
  helpPlacement = input<UiPlacement>('block-start-inline-end');
  hint = input<{ message: string; styleClass?: string }>();
  fieldState = input<FieldState<any, any>>();

  error = computed(() => this.fieldState()?.errors()[0]?.message);
  isTouched = computed(() => this.fieldState()?.touched());
  styleClass = computed(() => (this.isTouched() && this.error() ? 'ui-error' : ''));
}
