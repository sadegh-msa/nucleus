import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFabricConfig } from '@nucleus/fabric';
import { FieldValueComponent } from './field-value.component';

describe('FieldValueComponent', () => {
  let component: FieldValueComponent;
  let fixture: ComponentFixture<FieldValueComponent>;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldValueComponent],
      providers: [provideFabricConfig(mockConfig)],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldValueComponent);
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

  it('should have DataType available', () => {
    expect(component.DataType).toBeTruthy();
  });
});
