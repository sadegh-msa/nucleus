import { NgClass, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TippyProps } from '@ngneat/helipopper/lib/tippy.types';

export interface MenuItem {
  id?: string;
  label?: string;
  labelNgStyle?: NgStyle['ngStyle'];
  labelNgClass?: NgClass['ngClass'];
  tooltip?: string;
  tooltipPlacement?: TippyProps['placement'];
  icon?: string;
  iconNgStyle?: Record<string, string | number | boolean>;
  iconNgClass?: string;
  ngStyle?: NgStyle['ngStyle'];
  ngClass?: NgClass['ngClass'];
  disabled?: boolean;
  hidden?: boolean;
  href?: string;
  routerLink?: RouterLink['routerLink'];
  routerLinkActive?: string;
  permission?: string;
  expanded?: boolean;
  children?: MenuItem[];

  command?(...args: unknown[]): unknown;
}
