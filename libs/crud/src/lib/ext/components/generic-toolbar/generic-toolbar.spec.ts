import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { vi } from 'vitest';
import type { ToolModel } from '../../models/toolbar.model';
import { GenericToolbar } from './generic-toolbar';

setupGlobalMocks();

const CONFIRM_MESSAGE = 'Are you sure?';

const createTool = (overrides: Partial<ToolModel> = {}): ToolModel => ({
  command: vi.fn(),
  permission: 'delete',
  element: 'button',
  type: 'delete',
  key: 'delete',
  ...overrides,
});

describe('GenericToolbar', () => {
  let component: GenericToolbar;
  let fixture: ComponentFixture<GenericToolbar>;

  const mockToolbar = { tools: [] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericToolbar],
      providers: [
        provideRouter([]),
        provideNuCommonConfig(MOCK_NU_COMMON_CONFIG),
        provideUiConfig(MOCK_UI_CONFIG),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericToolbar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('toolbar', mockToolbar);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  describe('tool command buttons', () => {
    it('should run command immediately on click when tool has no confirm', () => {
      const tool = createTool();
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const button = fixture.debugElement.query((el) => el.nativeElement.tagName === 'BUTTON');
      button.nativeElement.click();

      expect(tool.command).toHaveBeenCalledTimes(1);
    });

    it('should not run command on click when tool has confirm', () => {
      const tool = createTool({ confirm: CONFIRM_MESSAGE });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const button = fixture.debugElement.query((el) => el.nativeElement.tagName === 'BUTTON');
      button.nativeElement.click();

      expect(tool.command).not.toHaveBeenCalled();
    });
  });
});
