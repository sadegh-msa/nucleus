import type { TemplateRef, WritableSignal } from '@angular/core';
import type { FabPlacement } from '../types';

export interface Popover {
  content: string | TemplateRef<unknown>;
  templateData?: unknown;
  styleClass: string;
  placement: FabPlacement;
  hasBubble: boolean;
  hasArrow: boolean;
  hasClose: boolean;
  closeDelay: number;
  visible: WritableSignal<boolean>;
  attachTo: 'parent' | 'body' | HTMLElement;
}

export type TriggerEvent = 'click' | 'hover';
