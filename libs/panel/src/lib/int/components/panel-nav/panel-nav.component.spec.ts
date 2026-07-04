import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NU_COMMON_CONFIG } from '@nucleus/common';
import { FABRIC_CONFIG } from '@nucleus/fabric';
import { MOCK_FABRIC_CONFIG, MOCK_NU_COMMON_CONFIG, setupGlobalMocks } from '@test-mocks';
import { NuPanelNavComponent } from './panel-nav.component';

setupGlobalMocks();

describe('NuPanelNavComponent', () => {
  let component: NuPanelNavComponent;
  let fixture: ComponentFixture<NuPanelNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuPanelNavComponent],
      providers: [
        provideRouter([]),
        { provide: NU_COMMON_CONFIG, useValue: MOCK_NU_COMMON_CONFIG },
        { provide: FABRIC_CONFIG, useValue: MOCK_FABRIC_CONFIG },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NuPanelNavComponent);
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
