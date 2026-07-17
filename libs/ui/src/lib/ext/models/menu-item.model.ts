import type { NgClass, NgStyle } from '@angular/common';
import type { RouterLink } from '@angular/router';
import type { FabPlacement, IconVariant } from '../types';

export interface MenuItemModel {
  id?: string;
  htmlLabel?: string;
  label?: string;
  labelNgStyle?: NgStyle['ngStyle'];
  labelNgClass?: NgClass['ngClass'];
  tooltip?: string;
  tooltipPlacement?: FabPlacement;
  submenuPlacement?: FabPlacement;
  icon?: string;
  iconVariant?: IconVariant;
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
  children?: MenuItemModel[];
  size?: number;
  isActive?: boolean;
  active?: MenuItemModel;
  original?: MenuItemModel;
  divider?: boolean;

  command?(...args: unknown[]): unknown;
}
