import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { ConfirmationService } from 'primeng/api';
import { GenericToolbar } from './generic-toolbar';

setupGlobalMocks();

describe('GenericToolbar', () => {
  let component: GenericToolbar;
  let fixture: ComponentFixture<GenericToolbar>;

  const mockToolbar = { tools: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericToolbar],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
        ConfirmationService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericToolbar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('toolbar', mockToolbar);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should have ToolElement enum', () => expect(component.ToolElement).toBeTruthy());
});
