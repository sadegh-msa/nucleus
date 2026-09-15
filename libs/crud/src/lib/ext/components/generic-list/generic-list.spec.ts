import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { vi } from 'vitest';
import { infoFieldsDefault } from '../../../int/constants';
import type { ToolModel } from '../../models/toolbar.model';
import { GenericList } from './generic-list';

setupGlobalMocks();

const CONFIRM_MESSAGE = 'Are you sure?';
const ALT_DATA_LENGTH = 10;

const createTool = (overrides: Partial<ToolModel> = {}): ToolModel => ({
  command: vi.fn(),
  permission: 'delete',
  element: 'button',
  type: 'delete',
  key: 'delete',
  ...overrides,
});

describe('GenericList', () => {
  let component: GenericList;
  let fixture: ComponentFixture<GenericList>;

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
      imports: [GenericList],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericList);
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

  it('should have default inputs', () => {
    expect(component.selectionMode()).toBeNull();
    expect(component.isActivatable()).toBe(false);
    expect(component.showLoading()).toBe(false);
    expect(component.firstRow()).toBe(0);
    expect(component.infoFields()).toBe(infoFieldsDefault);
  });

  it('should provide alternate data of fixed length', () => {
    expect(component.altData()).toHaveLength(ALT_DATA_LENGTH);
  });

  it('should emit selection', () => {
    const spy = vi.fn();
    component.selection.subscribe(spy);
    component.changeSelection([mockData[0]]);
    expect(spy).toHaveBeenCalledWith([mockData[0]]);
  });

  it('should activate a row', () => {
    fixture.componentRef.setInput('isActivatable', true);
    component.activateRow(mockData[0]);
    expect(component.activated()).toBe(mockData[0]);
  });

  it('should deactivate a row when activating the same row', () => {
    fixture.componentRef.setInput('isActivatable', true);
    component.activateRow(mockData[0]);
    component.activateRow(mockData[0]);
    expect(component.activated()).toBeNull();
  });

  it('should not activate rows when not activatable', () => {
    component.activateRow(mockData[0]);
    expect(component.activated()).toBeNull();
  });

  it('should keep no row activated when activating a falsy row', () => {
    fixture.componentRef.setInput('isActivatable', true);
    component.activateRow(null);
    expect(component.activated()).toBeNull();
  });

  it('should emit activation when activated signal changes', async () => {
    const spy = vi.fn();
    component.activation.subscribe(spy);

    component.activated.set(mockData[0]);
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith(mockData[0]);
  });

  it('should update activated signal from activatedRow input', async () => {
    fixture.componentRef.setInput('isActivatable', true);
    component.activateRow(mockData[0]);

    fixture.componentRef.setInput('activatedRow', mockData[1]);
    await fixture.whenStable();

    expect(component.activated()).toBe(mockData[1]);
  });

  it('should keep activated row when activatedRow input has the same id', async () => {
    fixture.componentRef.setInput('isActivatable', true);
    component.activateRow(mockData[0]);

    fixture.componentRef.setInput('activatedRow', mockData[0]);
    await fixture.whenStable();

    expect(component.activated()).toBe(mockData[0]);
  });

  it('should ignore activatedRow input when nothing is activated', async () => {
    fixture.componentRef.setInput('isActivatable', true);
    fixture.componentRef.setInput('activatedRow', mockData[1]);
    await fixture.whenStable();

    expect(component.activated()).toBeNull();
  });

  describe('tool command buttons', () => {
    const renderToolButton = (tool: ToolModel) => {
      fixture.componentRef.setInput('table', { ...mockTable, tools: [tool] });
      fixture.detectChanges();

      const row = fixture.debugElement.query((el) => el.nativeElement.tagName === 'TBODY');
      return row.query((el) => el.nativeElement.tagName === 'TR').query(
        (el) => el.nativeElement.tagName === 'BUTTON',
      );
    };

    it('should run command with row on click when tool has no confirm', () => {
      const tool = createTool();
      const button = renderToolButton(tool);

      button.nativeElement.click();

      expect(tool.command).toHaveBeenCalledTimes(1);
      expect(tool.command).toHaveBeenCalledWith(mockData[0]);
    });

    it('should not run command on click when tool has confirm', () => {
      const tool = createTool({ confirm: CONFIRM_MESSAGE });
      const button = renderToolButton(tool);

      button.nativeElement.click();

      expect(tool.command).not.toHaveBeenCalled();
    });
  });
});
