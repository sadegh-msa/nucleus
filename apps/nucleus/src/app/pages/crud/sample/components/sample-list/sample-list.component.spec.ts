import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideFabricConfig } from '@nucleus/fabric';
import { MOCK_FABRIC_CONFIG, MOCK_NU_COMMON_CONFIG, setupGlobalMocks } from '@test-mocks';
import { ConfirmationService } from 'primeng/api';
import { SampleListComponent } from './sample-list.component';

setupGlobalMocks();

describe('SampleListComponent', () => {
  let component: SampleListComponent;
  let fixture: ComponentFixture<SampleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleListComponent],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideFabricConfig(MOCK_FABRIC_CONFIG),
        ConfirmationService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SampleListComponent);
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

  it('should have filteredData initially empty', () => {
    expect(component.filteredData).toEqual([]);
  });
});
