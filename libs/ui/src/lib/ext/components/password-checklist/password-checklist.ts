import { Component, input } from '@angular/core';
import type { FieldState } from '@angular/forms/signals';
import type { PasswordStrengthModel } from '../../models';

@Component({
  selector: 'ui-password-checklist',
  imports: [],
  templateUrl: './password-checklist.html',
  host: {
    '[class]': 'styleClass()',
  },
})
export class UiPasswordChecklist {
  fieldState = input.required<FieldState<string, string>>();
  passwordStrength = input.required<PasswordStrengthModel>();
  styleClass = input('ui list checklist');
}

