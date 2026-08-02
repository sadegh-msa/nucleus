import type { TemplateRef, WritableSignal } from '@angular/core';
import type { UiPlacement } from '../types';

export interface UiPopoverModel {
  content: string | TemplateRef<unknown> | null | undefined;
  templateData?: unknown;
  styleClass: string;
  placement: UiPlacement;
  hasBubble: boolean;
  hasArrow: boolean;
  hasClose: boolean;
  closeDelay: number;
  visible: WritableSignal<boolean>;
  attachTo: 'parent' | 'body' | HTMLElement;
}

export type TriggerEventModel = 'click' | 'focus' | 'hover';
