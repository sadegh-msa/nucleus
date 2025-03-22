import { Signal, WritableSignal } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { ToolElement, ToolType } from '../enums/toolbar.enum';

export interface NuTool {
  command: ($event?: unknown) => string | unknown[];
  permission: string;
  element: ToolElement;
  type: ToolType;
  key: string;
  label?: string;
  tooltip?: string;
  icon?: string;
  styleClass?: string;
  confirm?: string;
  showLoading?: WritableSignal<boolean | number | string>;
  disabled?: WritableSignal<boolean>;
  createRouterStates?: (data: unknown) => Record<string, unknown>;
  createRouterQueryParams?: (data: unknown) =>  Params | null | undefined;
  routerStates?: Signal<Record<string, unknown>>;
  routerQueryParams?: Signal<Record<string, unknown>>;
  id?: Signal<string>;
}

export interface NuToolEvent {
  tool: NuTool;
  payload?: unknown;
}

export interface NuToolbar {
  tools: NuTool[];
  events$?: Observable<NuToolEvent>;
}
