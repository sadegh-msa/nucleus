import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { Button } from './button';

setupGlobalMocks();

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
      providers: [provideRouter([]), provideUiConfig(MOCK_UI_CONFIG)],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
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
