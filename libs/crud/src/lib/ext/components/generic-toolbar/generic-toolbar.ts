import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiPopover, UiRipple, UiSvgIcon, UiTooltip } from '@nucleus/ui';
import { AuthPermission } from '../../directives/auth-permission';
import type { ToolbarModel } from '../../models/toolbar.model';

@Component({
  selector: 'nu-generic-toolbar',
  templateUrl: './generic-toolbar.html',
  imports: [
    AuthPermission,
    RouterModule,
    NgClass,
    UiSvgIcon,
    UiTooltip,
    UiRipple,
    UiPopover
  ],
})
export class GenericToolbar {
  toolbar = input.required<ToolbarModel>();
}
