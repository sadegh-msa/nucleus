import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageType } from '../enums/page.enum';
import { GenericFormBuilder } from './generic-form-builder';

describe('GenericFormBuilder', () => {
  let service: GenericFormBuilder<any>;
  let router: { navigate: jest.Mock };

  beforeEach(() => {
    router = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [GenericFormBuilder, { provide: Router, useValue: router }],
    });
    service = TestBed.inject(GenericFormBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('run', () => {
    it('should throw error when init not called', () => {
      expect(() => service.run()).toThrow('It needs to be call "init" method at first!');
    });
  });

  describe('init', () => {
    it('should initialize consumer signals', () => {
      const consumer = createMockConsumer();

      service.init(consumer as any);

      expect(consumer.data).toBeDefined();
      expect(consumer.title).toBeDefined();
      expect(consumer.isSubmitting).toBeDefined();
      expect(consumer.isSubmitted).toBeDefined();
      expect(consumer.save).toBeDefined();
      expect(consumer.formControlHasError).toBeDefined();
    });

    it('should set default title to ...', () => {
      const consumer = createMockConsumer();

      service.init(consumer as any);

      expect(consumer.title()).toBe('...');
    });
  });

  describe('formControlHasError', () => {
    it('should return false when not submitted', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      const result = service.formControlHasError('name', 'required');

      expect(result).toBeFalsy();
    });
  });

  describe('save', () => {
    it('should set isSubmitted to true', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      service.save();

      expect(consumer.isSubmitted()).toBe(true);
    });

    it('should mark form as touched', () => {
      const consumer = createMockConsumer();
      service.init(consumer as any);

      service.save();

      expect(consumer.form.touched).toBe(true);
    });
  });
});

function createMockConsumer() {
  const form = new FormGroup({
    name: new FormControl(''),
    title: new FormControl(''),
  });

  return {
    data: signal({}),
    title: signal('...'),
    isSubmitting: signal(false),
    isSubmitted: signal(false),
    form,
    id: signal('123'),
    pageType: signal(PageType.View),
    isEmbedded: signal(false),
    save: jest.fn(),
    formControlHasError: jest.fn().mockReturnValue(false),
    config: {
      path: {
        page: {
          list: () => ['/list'],
          view: (id: string) => [`/view/${id}`],
        },
      },
      field: { id: 'id', title: 'title' },
    },
    store: {
      get: () => ({ status: 0, response: { data: {} }, tool: null }),
      add: () => ({ status: 0, response: { data: {} }, tool: null }),
      update: () => ({ status: 0, response: { data: {} }, tool: null }),
      delete: () => ({ status: 0, response: { data: '' }, tool: null }),
      loadGet: jest.fn(),
      loadAdd: jest.fn(),
      loadUpdate: jest.fn(),
      loadDelete: jest.fn(),
      resetGet: jest.fn(),
      resetAdd: jest.fn(),
      resetUpdate: jest.fn(),
      resetDelete: jest.fn(),
      getMutate: jest.fn(),
    },
    toolbar: { tools: [] },
    navigationState: undefined,
  };
}
