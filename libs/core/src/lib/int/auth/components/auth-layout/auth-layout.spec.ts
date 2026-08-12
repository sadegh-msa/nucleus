import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { vi } from 'vitest';
import { AuthToken } from '../../../../ext/auth/services/auth-token';
import { AuthLayout } from './auth-layout';

setupGlobalMocks();

describe('AuthLayout', () => {
  let component: AuthLayout;
  let fixture: ComponentFixture<AuthLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayout],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
        {
          provide: AuthToken,
          useValue: { isAuthenticated: vi.fn().mockReturnValue(false) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should expose branding config', () =>
    expect(component.branding).toBe(MOCK_NU_COMMON_CONFIG.branding));
});
