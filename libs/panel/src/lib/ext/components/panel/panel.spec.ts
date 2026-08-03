import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { Panel } from './panel';

setupGlobalMocks();

describe('Panel', () => {
  let component: Panel;
  let fixture: ComponentFixture<Panel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panel],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Panel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose navExtent', () => {
    expect(component.navExtent()).toBe('wide');
  });

  it('should expose isNavVisible', () => {
    expect(component.isNavVisible()).toBe(true);
  });

  it('should have styleClass with nav', () => {
    expect(component.styleClass()).toContain('nu');
  });
});
