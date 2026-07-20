import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCalendar } from './calendar';

describe('InputDate', () => {
  let component: UiCalendar;
  let fixture: ComponentFixture<UiCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
