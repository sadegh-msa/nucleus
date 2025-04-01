import { CommonModule } from '@angular/common';
import { Component, HostBinding, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FabPosition } from '../../types';

@Component({
  selector: 'fab-form-field',
  imports: [CommonModule],
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
  inputId = input('');
  label = input<string>();
  help = input<string>();
  helpPosition = input<FabPosition>('auto');
  inputFormControl = input<AbstractControl<any> | null>(null);
  messages = input<Record<string, string>>({});

  @HostBinding('class')
  get styleClass() {
    const hasError = this.inputFormControl()?.dirty && this.inputFormControl()?.errors;
    return hasError ? 'fab-error' : '';
  }
}
