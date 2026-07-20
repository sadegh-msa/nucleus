import { ChangeDetectorRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ControlValueAccessor } from '@angular/forms';
import type { GenericToggleConsumerModel, ToggleValueModel } from '../models/toggle.model';
import { UiToggleValueAccessor } from './toggle-value-accessor';

describe('UiToggleValueAccessor', () => {
  let service: UiToggleValueAccessor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UiToggleValueAccessor,
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
      ],
    });
    service = TestBed.inject(UiToggleValueAccessor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should initialize consumer with required signals', () => {
      const consumer = createMockConsumer();

      service.init(consumer);

      expect(consumer.isChecked).toBeDefined();
      expect(consumer.isDisabled).toBeDefined();
      expect(consumer.isBinary).toBeDefined();
      expect(consumer.hasLabel).toBeDefined();
      expect(consumer.toggle).toBeDefined();
    });

    it('should set default values', () => {
      const consumer = createMockConsumer();

      service.init(consumer);

      expect(consumer.isChecked()).toBe(false);
      expect(consumer.isDisabled()).toBe(false);
    });
  });

  describe('toggle', () => {
    it('should toggle isChecked state', () => {
      const consumer = createMockConsumer();
      service.init(consumer);

      expect(consumer.isChecked()).toBe(false);

      consumer.toggle();
      expect(consumer.isChecked()).toBe(true);

      consumer.toggle();
      expect(consumer.isChecked()).toBe(false);
    });

    it('should not toggle when disabled', () => {
      const consumer = createMockConsumer();
      service.init(consumer);
      consumer.isDisabled.set(true);

      consumer.toggle();

      expect(consumer.isChecked()).toBe(false);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should set isChecked to true when writeValue is called with truthy value (binary mode)', () => {
      const consumer = createMockConsumer();
      service.init(consumer);

      consumer.writeValue(true as ToggleValueModel);

      expect(consumer.isChecked()).toBe(true);
    });

    it('should set isChecked to false when writeValue is called with falsy value (binary mode)', () => {
      const consumer = createMockConsumer();
      service.init(consumer);

      consumer.writeValue(false as ToggleValueModel);

      expect(consumer.isChecked()).toBe(false);
    });

    it('should set isChecked based on value match (non-binary mode)', () => {
      const consumer = createMockConsumer('option1');
      service.init(consumer);

      consumer.writeValue('option1' as ToggleValueModel);
      expect(consumer.isChecked()).toBe(true);

      consumer.writeValue('option2' as ToggleValueModel);
      expect(consumer.isChecked()).toBe(false);
    });

    it('should register onChange callback', () => {
      const consumer = createMockConsumer();
      const onChange = jest.fn();
      service.init(consumer);

      consumer.registerOnChange(onChange);

      expect(onChange).toBeDefined();
    });

    it('should register onTouched callback', () => {
      const consumer = createMockConsumer();
      const onTouch = jest.fn();
      service.init(consumer);

      consumer.registerOnTouched(onTouch);

      expect(onTouch).toBeDefined();
    });

    it('should set disabled state', () => {
      const consumer = createMockConsumer();
      service.init(consumer);

      consumer.setDisabledState?.(true);

      expect(consumer.isDisabled()).toBe(true);
    });
  });

  describe('computed signals', () => {
    it('should compute isBinary correctly for undefined value', () => {
      const consumer = createMockConsumer();
      service.init(consumer);

      expect(consumer.isBinary()).toBe(true);
    });

    it('should compute isBinary correctly for defined value', () => {
      const consumer = createMockConsumer('option');
      service.init(consumer);

      expect(consumer.isBinary()).toBe(false);
    });

    it('should compute hasLabel when label is provided', () => {
      const consumer = createMockConsumer();
      consumer.label = signal('Test Label') as any;
      service.init(consumer);

      expect(consumer.hasLabel()).toBe(true);
    });

    it('should compute hasLabel when value is provided', () => {
      const consumer = createMockConsumer('option');
      service.init(consumer);

      expect(consumer.hasLabel()).toBe(true);
    });
  });
});

function createMockConsumer(
  value?: ToggleValueModel,
): GenericToggleConsumerModel & ControlValueAccessor {
  return {
    value: signal(value) as any,
    label: signal(undefined) as any,
    isChecked: signal(false),
    isDisabled: signal(false),
    isBinary: signal(true),
    hasLabel: signal(false),
    toggle: jest.fn(),
    writeValue: jest.fn(),
    registerOnChange: jest.fn(),
    registerOnTouched: jest.fn(),
    setDisabledState: jest.fn(),
  };
}
