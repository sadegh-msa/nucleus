import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { NU_COMMON_CONFIG } from '@nucleus/common';
import { FABRIC_CONFIG } from '@nucleus/fabric';
import { MOCK_FABRIC_CONFIG, MOCK_NU_COMMON_CONFIG, setupGlobalMocks } from '@test-mocks';
import { AuthTokenService } from '../../../../ext/auth/services/auth-token.service';
import { SignLayoutComponent } from './sign-layout.component';

setupGlobalMocks();

describe('SignLayoutComponent', () => {
  let component: SignLayoutComponent;
  let fixture: ComponentFixture<SignLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignLayoutComponent],
      providers: [
        provideRouter([]),
        provideMockStore(),
        { provide: NU_COMMON_CONFIG, useValue: MOCK_NU_COMMON_CONFIG },
        { provide: FABRIC_CONFIG, useValue: MOCK_FABRIC_CONFIG },
        {
          provide: AuthTokenService,
          useValue: { isAuthenticated: jest.fn().mockReturnValue(false) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SignLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should expose branding config', () =>
    expect(component.branding).toBe(MOCK_NU_COMMON_CONFIG.branding));
});
