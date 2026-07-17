import type { TemplateRef, WritableSignal } from '@angular/core';
import type { FabPlacement } from '../types';

export interface PopoverModel {
  content: string | TemplateRef<unknown> | null | undefined;
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

export type TriggerEventModel = 'click' | 'hover';
