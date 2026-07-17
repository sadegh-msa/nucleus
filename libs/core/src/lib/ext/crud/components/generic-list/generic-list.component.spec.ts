import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { ConfirmationService } from 'primeng/api';
import { GenericListComponent } from './generic-list.component';

setupGlobalMocks();

describe('GenericListComponent', () => {
  let component: GenericListComponent;
  let fixture: ComponentFixture<GenericListComponent>;

  const mockData = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
  ];

  const mockTable = {
    columns: [
      { field: 'id', label: 'ID' },
      { field: 'title', label: 'Title' },
    ],
    tools: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericListComponent],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
        ConfirmationService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('table', mockTable);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data input', () => {
    expect(component.data()).toBe(mockData);
  });

  it('should have default idField', () => {
    expect(component.idField()).toBe('id');
  });

  it('should emit selection', () => {
    const spy = jest.fn();
    component.selection.subscribe(spy);
    component.changeSelection([mockData[0]]);
    expect(spy).toHaveBeenCalledWith([mockData[0]]);
  });

  it('should activate a row', () => {
    component.activateRow(mockData[0]);
    expect(component.activated()).toBe(mockData[0]);
  });
});
