import { Service } from '@angular/core';
import type { PasswordStrengthModel } from '../models/password.model';

@Service()
export class PasswordValidator {
  readonly #moderateLength = 8;
  readonly #strongLength = 12;
  // At least 2 upper case characters
  readonly #upperCaseRegex = /^(?=.*[A-Z].*[A-Z]).+$/;
  // At least 2 lower case characters
  readonly #lowerCaseRegex = /^(?=.*[a-z].*[a-z]).+$/;
  // At least 2 digits
  readonly #digitRegex = /^(?=.*\d.*\d).+$/;
  // At least 2 special characters
  readonly #specialRegex = /^(?=.*[~!@#$%^&*()\-_=+{};:,<.>].*[~!@#$%^&*()\-_=+{};:,<.>]).+$/;
  // Consecutive repeated characters
  readonly #consecutiveRepeatedRegex = /(.)\1+/;

  check(password: string): PasswordStrengthModel {
    const hasMinLength = password.length >= this.#moderateLength;
    const hasUpperCase = this.#upperCaseRegex.test(password);
    const hasLowerCase = this.#lowerCaseRegex.test(password);
    const hasDigit = this.#digitRegex.test(password);
    const hasSpecial = this.#specialRegex.test(password);
    const hasConsecutiveRepeated = this.#consecutiveRepeatedRegex.test(password);
    const moderate =
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasDigit &&
      hasSpecial &&
      !hasConsecutiveRepeated;

    return {
      condition: {
        minLength: this.#moderateLength,
        upperCase: 2,
        lowerCase: 2,
        digit: 2,
        special: 2,
      },
      hasUpperCase,
      hasLowerCase,
      hasDigit,
      hasSpecial,
      hasConsecutiveRepeated,
      moderate,
      strong: password.length >= this.#strongLength && moderate,
    };
  }
}
