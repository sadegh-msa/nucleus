export interface PasswordStrengthModel {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  hasConsecutiveRepeated: boolean;
  moderate: boolean;
  strong: boolean;
  condition: {
    minLength: number;
    upperCase: number;
    lowerCase: number;
    digit: number;
    special: number;
  };
}
