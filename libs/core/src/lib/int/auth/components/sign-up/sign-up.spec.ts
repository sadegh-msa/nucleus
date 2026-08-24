import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { vi } from 'vitest';
import { provideAuthConfig } from '../../../../ext/auth/providers/auth-config-provider';
import { provideAuthStore } from '../../../../ext/auth/store/auth-store';
import { SignUp } from './sign-up';

setupGlobalMocks();

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;
  let signUp: ReturnType<typeof vi.fn>;
  let checkStatusSignal: ReturnType<typeof signal>;
  let signUpStatusSignal: ReturnType<typeof signal>;
  let signInStateSignal: ReturnType<typeof signal>;
  let signUpStateSignal: ReturnType<typeof signal>;
  let signOutStateSignal: ReturnType<typeof signal>;

  const initialSignInState = {
    status: 'initial',
    response: { token: { accessToken: null, refreshToken: null } },
    request: { email: '', password: '' },
    message: '',
  };

  const initialSignUpState = {
    status: 'initial',
    response: { token: { accessToken: null, refreshToken: null } },
    request: { email: '', password: '' },
    message: '',
  };

  const initialSignOutState = { status: 'initial', message: '' };

  function createMockAuthStore() {
    return {
      signIn: vi.fn(),
      get signUp() {
        return signUp;
      },
      signOut: vi.fn(),
      checkSuccess: vi.fn(),
      checkFailure: vi.fn(),
      checkStatus: () => checkStatusSignal(),
      signInStatus: () => signInStateSignal().status,
      signUpStatus: () => signUpStatusSignal(),
      signOutStatus: () => signOutStateSignal().status,
      isCheckSuccess: () => checkStatusSignal() === 'success',
      signInResponse: () => signInStateSignal().response,
      signUpResponse: () => signUpStateSignal().response,
      signInState: () => signInStateSignal(),
      signUpState: () => signUpStateSignal(),
      signOutState: () => signOutStateSignal(),
      checkState: () => ({ status: checkStatusSignal() }),
    };
  }

  beforeEach(async () => {
    signUp = vi.fn();
    checkStatusSignal = signal('initial');
    signUpStatusSignal = signal('initial');
    signInStateSignal = signal({ ...initialSignInState });
    signUpStateSignal = signal({ ...initialSignUpState });
    signOutStateSignal = signal({ ...initialSignOutState });

    const mockAuthStore = createMockAuthStore();

    await TestBed.configureTestingModule({
      imports: [SignUp],
      providers: [
        provideRouter([]),
        provideAuthStore({ useValue: mockAuthStore }),
        provideAuthConfig({ rememberMeExpiry: 60 }),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should have form fields', () => {
    expect(component.form.email).toBeTruthy();
    expect(component.form.password).toBeTruthy();
    expect(component.form.confirmPassword).toBeTruthy();
  });

  it('should have invalid form initially', () => expect(component.form().invalid()).toBe(true));

  it('should start with isSubmitting false', () => expect(component.isSubmitting()).toBe(false));

  it('should expose the configured form id', () => {
    expect(component.formId).toBe('signup-form');
  });

  it('should show strength hint as undefined when no password entered', () => {
    fixture.detectChanges();
    const hint = component.passwordHint();
    expect(hint.message).toBe('');
    expect(hint.styleClass).toBeUndefined();
  });

  it('should show moderate hint when password is moderate strength', () => {
    component.form.email().value.set('user@example.com');
    component.form.password().value.set('AB1!ab2@');
    component.passwordStrength.set({ moderate: true, strong: false });
    fixture.detectChanges();

    const hint = component.passwordHint();
    expect(hint.message).toBe('Moderate');
    expect(hint.styleClass).toBe('ui text warning');
  });

  it('should show strong hint when password is strong', () => {
    component.form.email().value.set('user@example.com');
    component.form.password().value.set('AB1!ab2@CD3#');
    component.passwordStrength.set({ moderate: true, strong: true });
    fixture.detectChanges();

    const hint = component.passwordHint();
    expect(hint.message).toBe('Strong');
    expect(hint.styleClass).toBe('ui text success');
  });

  it('should show match hint when passwords match', () => {
    component.form.password().value.set('AB1!ab2@CD3#');
    component.form.confirmPassword().value.set('AB1!ab2@CD3#');
    component.arePasswordsMatching.set(true);
    fixture.detectChanges();

    const hint = component.confirmPasswordHint();
    expect(hint).toEqual({ message: 'Match', styleClass: 'ui text success' });
  });

  it('should show undefined confirm hint when passwords do not match', () => {
    component.form.password().value.set('AB1!ab2@CD3#');
    component.form.confirmPassword().value.set('Different@123');
    component.arePasswordsMatching.set(false);
    fixture.detectChanges();

    expect(component.confirmPasswordHint()).toBeUndefined();
  });

  it('should show undefined confirm hint when password is empty', () => {
    component.form.password().value.set('');
    component.form.confirmPassword().value.set('Different@123');
    component.arePasswordsMatching.set(true);
    fixture.detectChanges();

    expect(component.confirmPasswordHint()).toBeUndefined();
  });

  it('should show undefined confirm hint when confirmPassword is empty', () => {
    component.form.password().value.set('AB1!ab2@CD3#');
    component.form.confirmPassword().value.set('');
    component.arePasswordsMatching.set(true);
    fixture.detectChanges();

    expect(component.confirmPasswordHint()).toBeUndefined();
  });

  it('should validate password required', () => {
    component.form.email().value.set('user@example.com');
    expect(component.form.password().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'required' })]),
    );
  });

  it('should validate email required', () => {
    component.form.password().value.set('AB1!ab2@CD3#');
    expect(component.form.email().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'required' })]),
    );
  });

  it('should validate email format', () => {
    component.form.email().value.set('not-an-email');
    fixture.detectChanges();

    expect(component.form.email().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'email' })]),
    );
  });

  it('should validate password strength (moderate)', () => {
    component.form.email().value.set('user@example.com');
    component.form.password().value.set('weak');
    component.passwordStrength.set({ moderate: false, strong: false });
    fixture.detectChanges();

    expect(component.form.password().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'strength' })]),
    );
  });

  it('should validate password max length of 36', () => {
    component.form.password().value.set('AB1!ab2@'.repeat(5));
    fixture.detectChanges();

    expect(component.form.password().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'maxLength' })]),
    );
  });

  it('should validate confirmPassword required', () => {
    component.form.password().value.set('AB1!ab2@CD3#');
    expect(component.form.confirmPassword().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'required' })]),
    );
  });

  it('should validate confirmPassword matches password', () => {
    component.form.password().value.set('AB1!ab2@CD3#');
    component.form.confirmPassword().value.set('Different@1234');
    component.arePasswordsMatching.set(false);
    fixture.detectChanges();

    expect(component.form.confirmPassword().errors()).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: 'match' })]),
    );
  });

  describe('onSubmit', () => {
    const validFilledForm = () => {
      component.form.email().value.set('user@example.com');
      component.form.password().value.set('AB1!ab2@CD3#');
      component.form.confirmPassword().value.set('AB1!ab2@CD3#');
      component.passwordStrength.set({ moderate: true, strong: true });
      component.arePasswordsMatching.set(true);
      fixture.detectChanges();
    };

    it('should not call signUp and mark as touched when form is invalid', () => {
      const event = { preventDefault: vi.fn() };
      component.onSubmit(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(signUp).not.toHaveBeenCalled();
      expect(component.form().touched()).toBe(true);
    });

    it('should not call signUp while submitting', () => {
      validFilledForm();
      signUpStatusSignal.set('inProgress' as any);
      TestBed.tick();
      expect(component.isSubmitting()).toBe(true);

      component.onSubmit({ preventDefault: vi.fn() } as any);
      expect(signUp).not.toHaveBeenCalled();
    });

    it('should call signUp without confirmPassword when form is valid', () => {
      validFilledForm();
      const event = { preventDefault: vi.fn() };

      component.onSubmit(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(signUp).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'AB1!ab2@CD3#',
        confirmPassword: undefined,
      });
    });

    it('should not call signUp when password is weak', () => {
      component.form.email().value.set('user@example.com');
      component.form.password().value.set('weak');
      component.form.confirmPassword().value.set('weak');
      component.passwordStrength.set({ moderate: false, strong: false });
      component.arePasswordsMatching.set(true);
      fixture.detectChanges();

      const event = { preventDefault: vi.fn() };
      component.onSubmit(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(signUp).not.toHaveBeenCalled();
    });

    it('should not call signUp when email is invalid', () => {
      component.form.email().value.set('not-an-email');
      component.form.password().value.set('AB1!ab2@CD3#');
      component.form.confirmPassword().value.set('AB1!ab2@CD3#');
      component.passwordStrength.set({ moderate: true, strong: true });
      component.arePasswordsMatching.set(true);
      fixture.detectChanges();

      const event = { preventDefault: vi.fn() };
      component.onSubmit(event as any);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(signUp).not.toHaveBeenCalled();
    });
  });

  it('should track isSubmitting from the store sign up status', () => {
    signUpStatusSignal.set('inProgress' as any);
    TestBed.tick();
    expect(component.isSubmitting()).toBe(true);

    signUpStatusSignal.set('success' as any);
    TestBed.tick();
    expect(component.isSubmitting()).toBe(false);
  });

  it('should track isSubmitting as false when status is failure', () => {
    signUpStatusSignal.set('failure' as any);
    TestBed.tick();
    expect(component.isSubmitting()).toBe(false);
  });
});
