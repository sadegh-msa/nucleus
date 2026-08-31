import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideUiConfig } from '@nucleus/ui';
import { FieldValue } from './field-value';

describe('FieldValue', () => {
  let component: FieldValue;
  let fixture: ComponentFixture<FieldValue>;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldValue],
      providers: [provideUiConfig(mockConfig)],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldValue);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 'test value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display text value', () => {
    fixture.componentRef.setInput('value', 'Hello World');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Hello World');
  });
});
