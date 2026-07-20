import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { UiToggle } from './toggle';

describe('InputDate', () => {
  let component: UiToggle;
  let fixture: ComponentFixture<UiToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(UiToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
