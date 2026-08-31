import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNuCommonConfig } from '@nucleus/common';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_NU_COMMON_CONFIG, MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { ConfirmationService } from 'primeng/api';
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
        ConfirmationService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericToolbar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('toolbar', mockToolbar);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  describe('runCommand', () => {
    let confirmSpy: ReturnType<typeof vi.spyOn>;
    let target: HTMLButtonElement;

    beforeEach(() => {
      confirmSpy = vi.spyOn(TestBed.inject(ConfirmationService), 'confirm');
      target = document.createElement('button') as HTMLButtonElement;
    });

    it('should run command immediately when tool has no confirm', () => {
      const tool = createTool();

      component.runCommand(target, tool);

      expect(tool.command).toHaveBeenCalledTimes(1);
      expect(tool.command).toHaveBeenCalledWith();
      expect(confirmSpy).not.toHaveBeenCalled();
    });

    it('should ask for confirmation instead of running command', () => {
      const tool = createTool({ confirm: CONFIRM_MESSAGE });

      component.runCommand(target, tool);

      expect(tool.command).not.toHaveBeenCalled();
      expect(confirmSpy).toHaveBeenCalledTimes(1);

      const options = confirmSpy.mock.calls[0][0];
      expect(options?.key).toBe('delete');
      expect(options?.target).toBe(target);
      expect(options?.message).toBe(CONFIRM_MESSAGE);
    });

    it('should run command when confirmation is accepted', () => {
      const tool = createTool({ confirm: CONFIRM_MESSAGE });

      component.runCommand(target, tool);
      confirmSpy.mock.calls[0][0]?.accept?.();

      expect(tool.command).toHaveBeenCalledTimes(1);
    });
  });
});
