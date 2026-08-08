import type { NgClass } from '@angular/common';
import type { Signal, WritableSignal } from '@angular/core';
import type { Params } from '@angular/router';
import type { UiIconVariant } from '@nucleus/ui';
import type { Observable } from 'rxjs';
import type { ToolElementType, ToolType } from '../types/toolbar.type';

export interface ToolModel {
  command: ($event?: unknown) => string | unknown[];
  permission: string;
  element: ToolElementType;
  type: ToolType;
  key: string;
  label?: string;
  tooltip?: string;
  icon?: string;
  iconVariant?: UiIconVariant;
  ngClass?: NgClass['ngClass'];
  confirm?: string;
  showLoading?: WritableSignal<boolean | number | string>;
  disabled?: WritableSignal<boolean>;
  createRouterStates?: (data: unknown) => Record<string, unknown>;
  createRouterQueryParams?: (data: unknown) => Params | null | undefined;
  routerStates?: Signal<Record<string, unknown>>;
  routerQueryParams?: Signal<Record<string, unknown>>;
  id?: Signal<string>;
}

export interface ToolEventModel {
  tool: ToolModel;
  payload?: unknown;
}

export interface ToolbarModel {
  tools: ToolModel[];
  events$?: Observable<ToolEventModel>;
}
