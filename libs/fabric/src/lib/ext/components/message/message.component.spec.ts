import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFabricConfig } from '../../providers';
import { MessageService } from '../../services';
import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let messageService: MessageService;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageComponent],
      providers: [provideFabricConfig(mockConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose messages from MessageService', () => {
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
