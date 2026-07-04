import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NU_COMMON_CONFIG } from '@nucleus/common';
import { FABRIC_CONFIG } from '@nucleus/fabric';
import { MOCK_FABRIC_CONFIG, MOCK_NU_COMMON_CONFIG, setupGlobalMocks } from '@test-mocks';
import { ConfirmationService } from 'primeng/api';
import { GenericToolbarComponent } from './generic-toolbar.component';

setupGlobalMocks();

describe('GenericToolbarComponent', () => {
  let component: GenericToolbarComponent;
  let fixture: ComponentFixture<GenericToolbarComponent>;

  const mockToolbar = { tools: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericToolbarComponent],
      providers: [
        provideRouter([]),
        { provide: NU_COMMON_CONFIG, useValue: MOCK_NU_COMMON_CONFIG },
        { provide: FABRIC_CONFIG, useValue: MOCK_FABRIC_CONFIG },
        ConfirmationService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericToolbarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('toolbar', mockToolbar);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should have ToolElement enum', () => expect(component.ToolElement).toBeTruthy());
});
