import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { NuPanelNav } from './panel-nav';

setupGlobalMocks();

describe('NuPanelNav', () => {
  let component: NuPanelNav;
  let fixture: ComponentFixture<NuPanelNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuPanelNav],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NuPanelNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have navExtent', () => {
    expect(component.navExtent).toBeTruthy();
  });

  it('should toggle nav mode', () => {
    const initial = component.navExtent();
    component.toggleNavMode();
    expect(component.navExtent()).not.toBe(initial);
  });
});
