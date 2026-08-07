import { PasswordValidator } from './password-validator';

describe('PasswordValidator', () => {
  let service: PasswordValidator;

  beforeEach(() => {
    service = new PasswordValidator();
  });

  describe('check', () => {
    it('should return all flags false for empty string', () => {
      const result = service.check('');
      expect(result).toEqual({
        hasUpperCase: false,
        hasLowerCase: false,
        hasDigit: false,
        hasSpecial: false,
        hasConsecutiveRepeated: false,
        moderate: false,
        strong: false,
        condition: {
          minLength: 8,
          upperCase: 2,
          lowerCase: 2,
          digit: 2,
          special: 2,
        },
      });
    });

    it('should not perform character checks below minimum length', () => {
      const result = service.check('Ab1!');
      expect(result.hasUpperCase).toBe(false);
      expect(result.hasLowerCase).toBe(false);
      expect(result.hasDigit).toBe(false);
      expect(result.hasSpecial).toBe(false);
      expect(result.hasConsecutiveRepeated).toBe(false);
      expect(result.moderate).toBe(false);
      expect(result.strong).toBe(false);
    });

    describe('individual character flags', () => {
      const validModerate = 'AB1!ab2@';

      it('should detect uppercase letters', () => {
        expect(service.check(validModerate).hasUpperCase).toBe(true);
      });

      it('should detect lowercase letters', () => {
        expect(service.check(validModerate).hasLowerCase).toBe(true);
      });

      it('should detect digits', () => {
        expect(service.check(validModerate).hasDigit).toBe(true);
      });

      it('should detect special characters', () => {
        expect(service.check(validModerate).hasSpecial).toBe(true);
      });

      it('should not flag non-repeating characters', () => {
        expect(service.check(validModerate).hasConsecutiveRepeated).toBe(false);
      });
    });

    describe('moderate strength', () => {
      it('should be true when all requirements met at exactly 8 chars', () => {
        expect(service.check('AB1!ab2@').moderate).toBe(true);
      });

      it('should be false when missing uppercase', () => {
        expect(service.check('ab1!ab2@').moderate).toBe(false);
      });

      it('should be false when missing lowercase', () => {
        expect(service.check('AB1!AB2@').moderate).toBe(false);
      });

      it('should be false when missing digits', () => {
        expect(service.check('AB!abAB!@').moderate).toBe(false);
      });

      it('should be false when missing special characters', () => {
        expect(service.check('AB1aAB2c').moderate).toBe(false);
      });

      it('should be false when has consecutive repeated characters', () => {
        expect(service.check('AB1!aabb2@').moderate).toBe(false);
      });
    });

    describe('strong strength', () => {
      it('should be true at exactly 12 chars with all requirements', () => {
        const result = service.check('AB1!ab2@CD3#');
        expect(result.moderate).toBe(true);
        expect(result.strong).toBe(true);
      });

      it('should be false at 11 chars even with all requirements', () => {
        const result = service.check('AB1!ab2@CD3');
        expect(result.moderate).toBe(true);
        expect(result.strong).toBe(false);
      });
    });

    describe('boundary conditions', () => {
      it('should require exactly 8 chars for moderate', () => {
        expect(service.check('AB1!ab2@').moderate).toBe(true);
      });

      it('should require exactly 12 chars for strong', () => {
        expect(service.check('AB1!ab2@CD3#').strong).toBe(true);
      });
    });

    describe('special characters', () => {
      it('should recognize all allowed special characters', () => {
        const specialChars = '~!@#$%^&*()_-=+{};:,<.>';
        const password = `AB1!ab2@${specialChars}`;
        expect(service.check(password).hasSpecial).toBe(true);
      });

      it('should not count regular characters as special', () => {
        expect(service.check('AB1ab2cdefg').hasSpecial).toBe(false);
      });
    });
  });
});
