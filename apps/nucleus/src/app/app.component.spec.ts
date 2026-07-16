import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideAuthStore } from '@nucleus/core';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_UI_CONFIG, MOCK_NU_COMMON_CONFIG, setupGlobalMocks } from '@test-mocks';
import { AppComponent } from './app.component';

setupGlobalMocks();

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideAuthStore(),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have navMainMenu', () => {
    expect(component.navMainMenu).toBeTruthy();
  });

  it('should have navFooterMenu', () => {
    expect(component.navFooterMenu.length).toBeGreaterThan(0);
  });

  it('should have isUserAuthenticated as false initially', () => {
    expect(component.isUserAuthenticated()).toBe(false);
  });

  it('should have showLoading as false initially', () => {
    expect(component.showLoading()).toBe(false);
  });

  it('should have htmlDir as ltr', () => {
    expect(component.htmlDir()).toBe('ltr');
  });
});
