import { TestBed } from '@angular/core/testing';
import { FABRIC_CONFIG } from '../providers';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: FABRIC_CONFIG, useValue: mockConfig }],
    });
    service = TestBed.inject(MessageService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('should add a message and return a key', () => {
      const key = service.add({ variant: 'info', content: 'Test message' });

      expect(key).toBe(1);
    });

    it('should increment keys for multiple messages', () => {
      const key1 = service.add({ variant: 'info', content: 'First' });
      const key2 = service.add({ variant: 'success', content: 'Second' });

      expect(key2).toBe(key1 + 1);
    });

    it('should store message in the messages signal', () => {
      service.add({ variant: 'info', content: 'Test' });

      const messages = service.messages();
      expect(messages.size).toBe(1);
    });

    it('should auto-remove message after duration', () => {
      service.add({ variant: 'info', content: 'Test', duration: 1000 });

      expect(service.messages().size).toBe(1);

      jest.advanceTimersByTime(1000);

      expect(service.messages().size).toBe(0);
    });

    it('should use default duration when not specified', () => {
      service.add({ variant: 'info', content: 'Test' });

      expect(service.messages().size).toBe(1);

      jest.advanceTimersByTime(5000);

      expect(service.messages().size).toBe(0);
    });

    it('should set title from variant when not provided', () => {
      service.add({ variant: 'success', content: 'Test' });

      const messages = service.messages();
      const message = messages.values().next().value;

      expect(message?.title).toBeTruthy();
    });

    it('should preserve custom title when provided', () => {
      service.add({ variant: 'info', content: 'Test', title: 'Custom Title' });

      const messages = service.messages();
      const message = messages.values().next().value;

      expect(message?.title).toBe('Custom Title');
    });
  });

  describe('remove', () => {
    it('should remove a message by key', () => {
      const key = service.add({ variant: 'info', content: 'Test' });

      service.remove(key);

      expect(service.messages().size).toBe(0);
    });

    it('should only remove the specified message', () => {
      const key1 = service.add({ variant: 'info', content: 'First' });
      service.add({ variant: 'info', content: 'Second' });

      service.remove(key1);

      expect(service.messages().size).toBe(1);
    });
  });

  describe('addSuccess', () => {
    it('should add a success message', () => {
      service.addSuccess('Operation completed');

      const messages = service.messages();
      const message = messages.values().next().value;

      expect(message?.variant).toBe('success');
      expect(message?.content).toBe('Operation completed');
    });
  });

  describe('addInfo', () => {
    it('should add an info message', () => {
      service.addInfo('Information');

      const messages = service.messages();
      const message = messages.values().next().value;

      expect(message?.variant).toBe('info');
      expect(message?.content).toBe('Information');
    });
  });

  describe('addWarning', () => {
    it('should add a warning message', () => {
      service.addWarning('Be careful');

      const messages = service.messages();
      const message = messages.values().next().value;

      expect(message?.variant).toBe('warning');
      expect(message?.content).toBe('Be careful');
    });
  });

  describe('addError', () => {
    it('should add an error message', () => {
      service.addError('Something went wrong');

      const messages = service.messages();
      const message = messages.values().next().value;

      expect(message?.variant).toBe('danger');
      expect(message?.content).toBe('Something went wrong');
    });

    it('should add an error message with code', () => {
      service.addError('Not found', 404);

      const messages = service.messages();
      const message = messages.values().next().value;

      expect(message?.code).toBe(404);
    });
  });
});
