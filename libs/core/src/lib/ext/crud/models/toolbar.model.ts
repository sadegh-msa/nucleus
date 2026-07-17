import type { NgClass } from '@angular/common';
import type { Signal, WritableSignal } from '@angular/core';
import type { Params } from '@angular/router';
import type { IconVariant } from '@nucleus/ui';
import type { Observable } from 'rxjs';
import type { ToolElement, ToolType } from '../enums/toolbar.enum';

export interface NuToolModel {
  command: ($event?: unknown) => string | unknown[];
  permission: string;
  element: ToolElement;
  type: ToolType;
  key: string;
  label?: string;
  tooltip?: string;
  icon?: string;
  iconVariant?: IconVariant;
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

export interface NuToolEventModel {
  tool: NuToolModel;
  payload?: unknown;
}

export interface NuToolbarModel {
  tools: NuToolModel[];
  events$?: Observable<NuToolEventModel>;
}
