import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NU_COMMON_CONFIG } from '@nucleus/common';
import { FABRIC_CONFIG } from '@nucleus/fabric';
import { MOCK_FABRIC_CONFIG, MOCK_NU_COMMON_CONFIG, setupGlobalMocks } from '@test-mocks';
import { PanelBreadcrumbComponent } from './panel-breadcrumb.component';

setupGlobalMocks();

describe('PanelBreadcrumbComponent', () => {
  let component: PanelBreadcrumbComponent;
  let fixture: ComponentFixture<PanelBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelBreadcrumbComponent],
      providers: [
        provideRouter([]),
        { provide: NU_COMMON_CONFIG, useValue: MOCK_NU_COMMON_CONFIG },
        { provide: FABRIC_CONFIG, useValue: MOCK_FABRIC_CONFIG },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
