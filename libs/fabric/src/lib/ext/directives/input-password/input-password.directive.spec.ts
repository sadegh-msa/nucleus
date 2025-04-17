import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputPasswordDirective } from './input-password.directive';

describe('InputPasswordComponent', () => {
  let component: InputPasswordDirective;
  let fixture: ComponentFixture<InputPasswordDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPasswordDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(InputPasswordDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
