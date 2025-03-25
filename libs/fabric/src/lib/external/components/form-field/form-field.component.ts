import { CommonModule } from '@angular/common';
import { Component, HostBinding, input, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FabPosition } from '../../types';

@Component({
  selector: 'fab-form-field',
  imports: [CommonModule],
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
  @Input() inputId = '';
  @Input() label?: string;
  @Input() help?: string;
  @Input() helpPosition: FabPosition = 'top-end';
  @Input() inputFormControl: AbstractControl<any> | null = null;
  messages = input<Record<string, string>>({});

  @HostBinding('class')
  get styleClass() {
    const hasError = this.inputFormControl?.dirty && this.inputFormControl?.errors;
    return hasError ? 'fab-error' : '';
  }
}
