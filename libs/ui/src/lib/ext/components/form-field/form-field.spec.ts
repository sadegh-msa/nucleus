import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { UiFormField } from './form-field';

describe('FormFieldText', () => {
  let component: UiFormField;
  let fixture: ComponentFixture<UiFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFormField],
    }).compileComponents();

    fixture = TestBed.createComponent(UiFormField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
