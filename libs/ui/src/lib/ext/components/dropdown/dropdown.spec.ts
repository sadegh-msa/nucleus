import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDropdown } from './dropdown';

describe('UiDropdown', () => {
  let component: UiDropdown;
  let fixture: ComponentFixture<UiDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
