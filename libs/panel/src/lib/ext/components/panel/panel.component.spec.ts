import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_UI_CONFIG, MOCK_NU_COMMON_CONFIG, setupGlobalMocks } from '@test-mocks';
import { PanelComponent } from './panel.component';

setupGlobalMocks();

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelComponent],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelComponent);
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
    expect(component.styleClass).toContain('nu');
  });
});
