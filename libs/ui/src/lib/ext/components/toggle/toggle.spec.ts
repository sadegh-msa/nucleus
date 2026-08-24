import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiToggle } from './toggle';

@Component({
  template: '<ui-toggle [formControl]="control" />',
  imports: [ReactiveFormsModule, UiToggle],
})
class FormControlHostComponent {
  control = new FormControl<boolean | null>(false);
}

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

describe('UiToggle form control', () => {
  let fixture: ComponentFixture<FormControlHostComponent>;
  let host: FormControlHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormControlHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormControlHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());

  it('should resolve the NG_VALUE_ACCESSOR provider and propagate user toggles', () => {
    const chassis = fixture.nativeElement.querySelector('.ui-toggle-chassis') as HTMLElement;
    expect(chassis).toBeTruthy();
    expect(host.control.value).toBe(false);

    chassis.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(host.control.value).toBe(true);
  });

  it('should write external control changes into the toggle', () => {
    host.control.setValue(true);
    fixture.detectChanges();

    const chassis = fixture.nativeElement.querySelector('.ui-toggle-chassis') as HTMLElement;
    expect(chassis.classList.contains('checked')).toBe(true);
  });
});
