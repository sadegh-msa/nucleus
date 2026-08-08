import type { TemplateRef, WritableSignal } from '@angular/core';
import type { UiPlacementType } from '../types';

export interface UiPopoverModel {
  content: string | TemplateRef<unknown> | null | undefined;
  templateData?: unknown;
  styleClass: string;
  placement: UiPlacementType;
  hasBubble: boolean;
  hasArrow: boolean;
  hasClose: boolean;
  closeDelay: number;
  visible: WritableSignal<boolean>;
  attachTo: 'parent' | 'body' | HTMLElement;
}
