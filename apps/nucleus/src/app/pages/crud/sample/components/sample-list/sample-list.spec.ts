import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { ConfirmationService } from 'primeng/api';
import { SampleList } from './sample-list';

setupGlobalMocks();

describe('SampleList', () => {
  let component: SampleList;
  let fixture: ComponentFixture<SampleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleList],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
        ConfirmationService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SampleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have config', () => {
    expect(component.config).toBeTruthy();
  });

  it('should have table with columns', () => {
    expect(component.table.columns.length).toBeGreaterThan(0);
  });

  it('should have data initially empty', () => {
    expect(component.data()).toEqual([]);
  });
});
