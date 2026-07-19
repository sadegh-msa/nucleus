import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideUiConfig } from '../../providers';
import { MessageManager } from '../../services/message-manager';
import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let messageService: MessageManager;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageComponent],
      providers: [provideUiConfig(mockConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageManager);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose messages from Message', () => {
    expect(component.messages).toBe(messageService.messages);
  });

  it('should show no messages initially', () => {
    expect(component.messages().size).toBe(0);
  });

  it('should reflect added messages', () => {
    jest.useFakeTimers();
    messageService.add({ variant: 'info', content: 'Test' });
    fixture.detectChanges();

    expect(component.messages().size).toBe(1);
  });
});
