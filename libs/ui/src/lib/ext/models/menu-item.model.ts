import type { NgClass, NgStyle } from '@angular/common';
import type { RouterLink } from '@angular/router';
import type { UiIconVariant, UiPlacementType } from '../types';

export interface UiMenuItemModel {
  id?: string;
  htmlLabel?: string;
  label?: string;
  labelNgStyle?: NgStyle['ngStyle'];
  labelNgClass?: NgClass['ngClass'];
  tooltip?: string;
  tooltipPlacement?: UiPlacementType;
  submenuPlacement?: UiPlacementType;
  icon?: string;
  iconVariant?: UiIconVariant;
  iconGenerateId?: boolean;
  iconNgStyle?: NgStyle['ngStyle'];
  iconNgClass?: NgClass['ngClass'];
  ngStyle?: NgStyle['ngStyle'];
  ngClass?: NgClass['ngClass'];
  disabled?: boolean;
  hidden?: boolean;
  href?: string;
  routerLink?: RouterLink['routerLink'];
  permission?: string;
  expanded?: boolean;
  children?: UiMenuItemModel[];
  size?: number;
  isActive?: boolean;
  active?: UiMenuItemModel;
  original?: UiMenuItemModel;
  divider?: boolean;

  command?(...args: unknown[]): unknown;
}
