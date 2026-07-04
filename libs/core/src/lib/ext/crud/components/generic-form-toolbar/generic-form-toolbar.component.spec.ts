import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FABRIC_CONFIG } from '@nucleus/fabric';
import { ConfirmationService } from 'primeng/api';
import { GenericFormToolbarComponent } from './generic-form-toolbar.component';

describe('GenericFormToolbarComponent', () => {
  let component: GenericFormToolbarComponent;
  let fixture: ComponentFixture<GenericFormToolbarComponent>;

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
      imports: [GenericFormToolbarComponent],
      providers: [{ provide: FABRIC_CONFIG, useValue: mockConfig }, ConfirmationService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericFormToolbarComponent);
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
