import { Component, signal, ViewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { FieldState } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { UiFormField } from './form-field';

interface MockError {
  kind: string;
  message?: string;
}

function createMockFieldState(
  errors: MockError[] = [],
  touched = false,
  dirty = false,
  required = false,
): FieldState<any, any> {
  return {
    errors: () => errors,
    touched: () => touched,
    dirty: () => dirty,
    required: () => required,
  } as unknown as FieldState<any, any>;
}

@Component({
  template: `
    <ui-form-field
      [inputId]="inputId()"
      [label]="label()"
      [help]="help()"
      [helpPlacement]="helpPlacement()"
      [hint]="hint()"
      [fieldState]="fieldState()"
    />
  `,
  standalone: true,
  imports: [UiFormField],
})
class TestHostComponent {
  @ViewChild(UiFormField, { static: true }) readonly formField!: UiFormField;

  readonly inputId = signal('');
  readonly label = signal<string | undefined>(undefined);
  readonly help = signal<string | undefined>(undefined);
  readonly helpPlacement = signal('block-start-inline-end');
  readonly hint = signal<{ message: string; styleClass?: string } | undefined>(undefined);
  readonly fieldState = signal<FieldState<any, any> | undefined>(undefined);
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
      fixture.detectChanges();

      expect(host.formField.error()).toBeUndefined();
    });

    it('should return the first error message when fieldState has errors', () => {
      host.fieldState.set(createMockFieldState([{ kind: 'required', message: 'Required' }]));
      fixture.detectChanges();

      expect(host.formField.error()).toBe('Required');
    });

    it('should return undefined when fieldState has no errors', () => {
      host.fieldState.set(createMockFieldState([]));
      fixture.detectChanges();

      expect(host.formField.error()).toBeUndefined();
    });

    it('should return undefined when first error has no message', () => {
      host.fieldState.set(createMockFieldState([{ kind: 'required' }]));
      fixture.detectChanges();

      expect(host.formField.error()).toBeUndefined();
    });

    it('should return only the first error message when multiple errors exist', () => {
      host.fieldState.set(
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
      fixture.detectChanges();

      expect(host.formField.isTouched()).toBeUndefined();
    });

    it('should return true when fieldState is touched', () => {
      host.fieldState.set(createMockFieldState([], true));
      fixture.detectChanges();

      expect(host.formField.isTouched()).toBe(true);
    });

    it('should return false when fieldState is not touched', () => {
      host.fieldState.set(createMockFieldState([], false));
      fixture.detectChanges();

      expect(host.formField.isTouched()).toBe(false);
    });

    it('should return false when fieldState is dirty but not touched', () => {
      host.fieldState.set(createMockFieldState([], false, true));
      fixture.detectChanges();

      expect(host.formField.isTouched()).toBe(false);
    });
  });

  describe('styleClass', () => {
    it('should return empty string when no fieldState provided', () => {
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('');
    });

    it('should return ui-error when touched and has error', () => {
      host.fieldState.set(createMockFieldState([{ kind: 'required', message: 'Required' }], true));
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('ui-error');
    });

    it('should return empty string when touched but no error', () => {
      host.fieldState.set(createMockFieldState([], true));
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('');
    });

    it('should return empty string when has error but not touched', () => {
      host.fieldState.set(createMockFieldState([{ kind: 'required', message: 'Required' }], false));
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('');
    });

    it('should return empty string when dirty and has error but not touched', () => {
      host.fieldState.set(
        createMockFieldState([{ kind: 'required', message: 'Required' }], false, true),
      );
      fixture.detectChanges();

      expect(host.formField.styleClass()).toBe('');
    });
  });

  describe('host binding', () => {
    it('should bind styleClass to host class', () => {
      host.fieldState.set(createMockFieldState([{ kind: 'required', message: 'Required' }], true));
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('ui-form-field'));
      expect(host.formField.styleClass()).toBe('ui-error');
      expect(el.nativeElement.className).toBe('ui-error');
    });

    it('should have empty class when no error or touched', () => {
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('ui-form-field'));
      expect(el.nativeElement.className).toBe('');
    });
  });
});
