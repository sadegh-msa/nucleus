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

  describe('link elements', () => {
    it('should render link element', () => {
      const tool = createTool({ element: 'link', command: () => ['/test'], key: 'link1' });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const link = fixture.debugElement.query((el) => el.nativeElement.tagName === 'A');
      expect(link).toBeTruthy();
    });

    it('should apply ngClass to link when specified', () => {
      const tool = createTool({ element: 'link', ngClass: 'custom-link-class', key: 'ngclass2' });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const link = fixture.debugElement.query((el) => el.nativeElement.tagName === 'A');
      expect(link.nativeElement.classList.contains('custom-link-class')).toBe(true);
    });

    it('should apply disabled class to link when disabled', () => {
      const disabledSignal = { value: true };
      const tool = createTool({ element: 'link', disabled: () => disabledSignal.value, key: 'disabled3' });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const link = fixture.debugElement.query((el) => el.nativeElement.tagName === 'A');
      expect(link.nativeElement.classList.contains('disabled')).toBe(true);
    });
  });

  describe('button elements', () => {
    it('should apply ngClass to button when specified', () => {
      const tool = createTool({ ngClass: 'custom-btn-class', key: 'ngclass1' });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const button = fixture.debugElement.query((el) => el.nativeElement.tagName === 'BUTTON');
      expect(button.nativeElement.classList.contains('custom-btn-class')).toBe(true);
    });

    it('should disable button when disabled signal is true', () => {
      const disabledSignal = { value: true };
      const tool = createTool({ disabled: () => disabledSignal.value, key: 'disabled1' });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const button = fixture.debugElement.query((el) => el.nativeElement.tagName === 'BUTTON');
      expect(button.nativeElement.disabled).toBe(true);
    });

    it('should enable button when disabled signal is false', () => {
      const disabledSignal = { value: false };
      const tool = createTool({ disabled: () => disabledSignal.value, key: 'disabled2' });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const button = fixture.debugElement.query((el) => el.nativeElement.tagName === 'BUTTON');
      expect(button.nativeElement.disabled).toBe(false);
    });
  });

  describe('label rendering', () => {
    it('should render label when tool has label property', () => {
      const tool = createTool({ label: 'Edit', key: 'label1' });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const button = fixture.debugElement.query((el) => el.nativeElement.tagName === 'BUTTON');
      expect(button.nativeElement.textContent).toContain('Edit');
    });

    it('should not render label span when tool has no label', () => {
      const tool = createTool({ label: undefined, key: 'label2' });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const button = fixture.debugElement.query((el) => el.nativeElement.tagName === 'BUTTON');
      const spans = button.nativeElement.querySelectorAll('span');
      expect(spans.length).toBe(0);
    });
  });

  describe('multiple tools', () => {
    it('should render multiple tools in order', () => {
      const tool1 = createTool({ key: 'tool1', label: 'First' });
      const tool2 = createTool({ key: 'tool2', label: 'Second' });
      const tool3 = createTool({ key: 'tool3', label: 'Third' });
      fixture.componentRef.setInput('toolbar', { tools: [tool1, tool2, tool3] });
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll((el) => el.nativeElement.tagName === 'BUTTON');
      expect(buttons.length).toBe(3);
      expect(buttons[0].nativeElement.textContent).toContain('First');
      expect(buttons[1].nativeElement.textContent).toContain('Second');
      expect(buttons[2].nativeElement.textContent).toContain('Third');
    });
  });

  describe('template structure', () => {
    it('should have menu element with toolbar-start class', () => {
      const tool = createTool({ key: 'struct1' });
      fixture.componentRef.setInput('toolbar', { tools: [tool] });
      fixture.detectChanges();

      const menu = fixture.debugElement.query((el) => el.nativeElement.tagName === 'MENU');
      expect(menu).toBeTruthy();
      expect(menu.nativeElement.classList.contains('toolbar-start')).toBe(true);
    });

    it('should have li wrapper for each tool', () => {
      const tool1 = createTool({ key: 'tool1' });
      const tool2 = createTool({ key: 'tool2' });
      fixture.componentRef.setInput('toolbar', { tools: [tool1, tool2] });
      fixture.detectChanges();

      const lis = fixture.debugElement.queryAll((el) => el.nativeElement.tagName === 'LI');
      expect(lis.length).toBe(2);
    });
  });
});
