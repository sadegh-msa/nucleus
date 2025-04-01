import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxDirective } from './checkbox.directive';

describe('InputDateComponent', () => {
  let component: CheckboxDirective;
  let fixture: ComponentFixture<CheckboxDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
