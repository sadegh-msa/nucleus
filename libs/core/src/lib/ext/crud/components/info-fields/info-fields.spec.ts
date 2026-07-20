import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideUiConfig } from '@nucleus/ui';
import { InfoFields } from './info-fields';

describe('InfoFields', () => {
  let component: InfoFields;
  let fixture: ComponentFixture<InfoFields>;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  const mockInfoFields = [
    [
      { field: 'title', label: 'Title' },
      { field: 'code', label: 'Code' },
    ],
  ];

  const mockData = { title: 'Test Title', code: 'T001' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoFields],
      providers: [provideUiConfig(mockConfig)],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoFields);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('infoFields', mockInfoFields);
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have infoFields input', () => {
    expect(component.infoFields()).toBe(mockInfoFields);
  });

  it('should have data input', () => {
    expect(component.data()).toBe(mockData);
  });
});
