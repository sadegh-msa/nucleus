import { Component, input, signal, ViewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { FieldState } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { UiFormField } from './form-field';

function createMockFieldState(
  errors: Array<{ kind: string; message?: string }> = [],
  touched = false,
  dirty = false,
  required = false,
): FieldState<any, any> {
  return {
    errors: signal(errors),
    touched: signal(touched),
    dirty: signal(dirty),
    required: signal(required),
    value: signal(null),
    controlValue: signal(null),
  } as unknown as FieldState<any, any>;
}

@Component({
  template: `
    <fieldset
      uiFormField
      [label]="label()"
      [help]="help()"
      [helpPlacement]="helpPlacement()"
      [hint]="hint()"
      [fieldState]="fieldState()"
    ></fieldset>
  `,
  standalone: true,
  imports: [UiFormField],
})
class TestHostComponent {
  @ViewChild(UiFormField, { static: true }) readonly formField!: UiFormField;

  readonly label = input<string | undefined>(undefined);
  readonly help = input<string | undefined>(undefined);
  readonly helpPlacement = input('block-start-inline-end');
  readonly hint = input<{ message: string; styleClass?: string } | undefined>(undefined);
  readonly fieldState = input.required<FieldState<any, any>>();
}

describe('UiFormField', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.componentRef.setInput('fieldState', createMockFieldState());
  });

  afterEach(() => {
    fixture?.destroy?.();
  });

  describe('creation', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(host.formField).toBeTruthy();
    });

    it('should have default values for inputs', () => {
      fixture.componentRef.setInput('fieldState', undefined);
      fixture.detectChanges();

      expect(host.formField.inputId()).toBe('');
      expect(host.formField.label()).toBeUndefined();
      expect(host.formField.help()).toBeUndefined();
      expect(host.formField.helpPlacement()).toBe('block-start-inline-end');
      expect(host.formField.hint()).toBeUndefined();
      expect(host.formField.fieldState()).toBeUndefined();
    });
  });

  describe('error', () => {
    it('should return undefined when no fieldState provided', () => {
      fixture.componentRef.setInput('fieldState', undefined);
      fixture.detectChanges();

      expect(host.formField.error()).toBeUndefined();
    });

    it('should return the first error message when fieldState has errors', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([{ kind: 'required', message: 'Required' }]),
      );
      fixture.detectChanges();

      expect(host.formField.error()).toBe('Required');
    });

    it('should return undefined when fieldState has no errors', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([]));
      fixture.detectChanges();

      expect(host.formField.error()).toBeUndefined();
    });

    it('should return undefined when first error has no message', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([{ kind: 'required' }]));
      fixture.detectChanges();

      expect(host.formField.error()).toBeUndefined();
    });

    it('should return only the first error message when multiple errors exist', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([
          { kind: 'required', message: 'Required' },
          { kind: 'minlength', message: 'Too short' },
        ]),
      );
      fixture.detectChanges();

      expect(host.formField.error()).toBe('Required');
    });
  });

  describe('isTouched', () => {
    it('should return undefined when no fieldState provided', () => {
      fixture.componentRef.setInput('fieldState', undefined);
      fixture.detectChanges();

      expect(host.formField.isTouched()).toBeUndefined();
    });

    it('should return true when fieldState is touched', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], true));
      fixture.detectChanges();

      expect(host.formField.isTouched()).toBe(true);
    });

    it('should return false when fieldState is not touched', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], false));
      fixture.detectChanges();

      expect(host.formField.isTouched()).toBe(false);
    });

    it('should return false when fieldState is dirty but not touched', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], false, true));
      fixture.detectChanges();

      expect(host.formField.isTouched()).toBe(false);
    });
  });

  describe('isDirty', () => {
    it('should return undefined when no fieldState provided', () => {
      fixture.componentRef.setInput('fieldState', undefined);
      fixture.detectChanges();

      expect(host.formField.isDirty()).toBeUndefined();
    });

    it('should return true when fieldState is dirty', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], false, true));
      fixture.detectChanges();

      expect(host.formField.isDirty()).toBe(true);
    });

    it('should return false when fieldState is not dirty', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], false, false));
      fixture.detectChanges();

      expect(host.formField.isDirty()).toBe(false);
    });

    it('should return false when fieldState is touched but not dirty', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], true, false));
      fixture.detectChanges();

      expect(host.formField.isDirty()).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('should return undefined when no fieldState provided', () => {
      fixture.componentRef.setInput('fieldState', undefined);
      fixture.detectChanges();

      expect(host.formField.isRequired()).toBeUndefined();
    });

    it('should return true when fieldState is required', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], false, false, true));
      fixture.detectChanges();

      expect(host.formField.isRequired()).toBe(true);
    });

    it('should return false when fieldState is not required', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], false, false, false));
      fixture.detectChanges();

      expect(host.formField.isRequired()).toBe(false);
    });
  });

  describe('hasError', () => {
    it('should return false when no fieldState provided', () => {
      fixture.componentRef.setInput('fieldState', undefined);
      fixture.detectChanges();

      expect(host.formField.hasError()).toBe(false);
    });

    it('should return true when touched and has error', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([{ kind: 'required', message: 'Required' }], true),
      );
      fixture.detectChanges();

      expect(host.formField.hasError()).toBe(true);
    });

    it('should return false when touched but no error', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], true));
      fixture.detectChanges();

      expect(host.formField.hasError()).toBe(false);
    });

    it('should return false when has error but not touched', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([{ kind: 'required', message: 'Required' }], false),
      );
      fixture.detectChanges();

      expect(host.formField.hasError()).toBe(false);
    });
  });

  describe('styleClass', () => {
    it('should return base class when no fieldState provided', () => {
      fixture.componentRef.setInput('fieldState', undefined);
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('ui form-field');
    });

    it('should return base class with error when touched and has error', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([{ kind: 'required', message: 'Required' }], true),
      );
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('ui form-field error');
    });

    it('should return base class when touched but no error', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], true));
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('ui form-field');
    });

    it('should return base class when has error but not touched', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([{ kind: 'required', message: 'Required' }], false),
      );
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('ui form-field');
    });

    it('should return base class with error when dirty and has error but not touched', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([{ kind: 'required', message: 'Required' }], false, true),
      );
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('ui form-field error');
    });
  });

  describe('host binding', () => {
    it('should bind styleClass to host class', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([{ kind: 'required', message: 'Required' }], true),
      );
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('fieldset'));
      expect(host.formField.styleClass()).toBe('ui form-field error');
      expect(el.nativeElement.className).toBe('error form-field ui');
    });

    it('should have base class when no error or touched', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState());
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('fieldset'));
      expect(el.nativeElement.className).toBe('form-field ui');
    });
  });

  describe('template', () => {
    it('should render label when provided', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.componentRef.setInput('fieldState', createMockFieldState());
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent.trim()).toBe('Email');
    });

    it('should render required asterisk when fieldState is required', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.componentRef.setInput('fieldState', createMockFieldState([], false, false, true));
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.textContent.trim()).toContain('*');
    });

    it('should render help icon when help text provided', () => {
      fixture.componentRef.setInput('help', 'Enter your email');
      fixture.componentRef.setInput('fieldState', createMockFieldState());
      fixture.detectChanges();

      const helpIcon = fixture.debugElement.query(By.css('i.help'));
      expect(helpIcon).toBeTruthy();
    });

    it('should render error message when touched and has error', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([{ kind: 'required', message: 'Required' }], true),
      );
      fixture.detectChanges();

      const message = fixture.debugElement.query(By.css('.message'));
      expect(message).toBeTruthy();
      expect(message.nativeElement.textContent.trim()).toBe('Required');
    });

    it('should render hint message when touched and has hint', () => {
      fixture.componentRef.setInput('fieldState', createMockFieldState([], true));
      fixture.componentRef.setInput('hint', { message: 'Enter a valid email' });
      fixture.detectChanges();

      const message = fixture.debugElement.query(By.css('.message'));
      expect(message).toBeTruthy();
      expect(message.nativeElement.textContent.trim()).toBe('Enter a valid email');
    });

    it('should not render message when not touched', () => {
      fixture.componentRef.setInput(
        'fieldState',
        createMockFieldState([{ kind: 'required', message: 'Required' }], false),
      );
      fixture.detectChanges();

      const message = fixture.debugElement.query(By.css('.message'));
      expect(message).toBeFalsy();
    });

    it('should render ng-content', () => {
      @Component({
        template: `
          <fieldset
          uiFormField
          [fieldState]="fieldState()"
          >
            <input type="text" />
          </fieldset>
        `,
        standalone: true,
        imports: [UiFormField],
      })
      class ContentHostComponent {
        readonly fieldState = signal(
          createMockFieldState([], true));
      }

      const contentFixture = TestBed.createComponent(ContentHostComponent);
      contentFixture.detectChanges();

      const input = contentFixture.debugElement.query(By.css('input'));
      expect(input).toBeTruthy();
    });
  });
});
