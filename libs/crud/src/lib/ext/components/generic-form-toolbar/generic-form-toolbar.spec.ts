import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideUiConfig } from '@nucleus/ui';
import { GenericFormToolbar } from './generic-form-toolbar';

describe('GenericFormToolbar', () => {
  let component: GenericFormToolbar;
  let fixture: ComponentFixture<GenericFormToolbar>;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  const mockToolbar = {
    left: [],
    right: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericFormToolbar],
      providers: [provideUiConfig(mockConfig)],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericFormToolbar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('toolbar', mockToolbar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default infoFields', () => {
    expect(component.infoFields()).toBeTruthy();
  });

  it('should have toolbar input set', () => {
    expect(component.toolbar()).toBe(mockToolbar);
  });
});
