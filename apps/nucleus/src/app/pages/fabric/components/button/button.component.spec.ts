import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FABRIC_CONFIG } from '@nucleus/fabric';
import { MOCK_FABRIC_CONFIG, setupGlobalMocks } from '@test-mocks';
import { ButtonComponent } from './button.component';

setupGlobalMocks();

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
      providers: [provideRouter([]), { provide: FABRIC_CONFIG, useValue: MOCK_FABRIC_CONFIG }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have colors', () => {
    expect(component.colors.length).toBeGreaterThan(0);
  });

  it('should have sizes', () => {
    expect(component.sizes.length).toBeGreaterThan(0);
  });

  it('should have variants', () => {
    expect(component.variants).toContain('basic');
    expect(component.variants).toContain('bulk');
  });
});
