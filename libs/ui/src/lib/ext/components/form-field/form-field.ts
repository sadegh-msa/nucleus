import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import type { UiPlacement } from '../../types';

@Component({
  selector: 'ui-form-field',
  imports: [KeyValuePipe],
  templateUrl: './form-field.html',
  host: {
    '[class]': 'styleClass',
  },
})
export class UiFormField {
  inputId = input('');
  label = input<string>();
  help = input<string>();
  helpPlacement = input<UiPlacement>('auto');
  inputFormControl = input<AbstractControl<any> | null>(null);
  messages = input<Record<string, string>>({});

  get styleClass() {
    const formControl = this.inputFormControl();
    return formControl?.dirty && formControl.errors ? 'ui-error' : '';
  }
}
