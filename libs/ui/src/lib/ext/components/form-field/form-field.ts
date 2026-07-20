import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import type { FabPlacement } from '../../types';

@Component({
  selector: 'ui-form-field',
  imports: [KeyValuePipe],
  templateUrl: './form-field.html',
  host: {
    '[class]': 'styleClass',
  },
})
export class FormField {
  inputId = input('');
  label = input<string>();
  help = input<string>();
  helpPlacement = input<FabPlacement>('auto');
  inputFormControl = input<AbstractControl<any> | null>(null);
  messages = input<Record<string, string>>({});

  get styleClass() {
    const hasError = this.inputFormControl()?.dirty && this.inputFormControl()?.errors;
    return hasError ? 'ui-error' : '';
  }
}
