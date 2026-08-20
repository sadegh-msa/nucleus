import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiRipple, UiSvgIcon, UiTooltip } from '@nucleus/ui';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AuthPermission } from '../../../auth';
import type { ToolbarModel, ToolModel } from '../../models/toolbar.model';

@Component({
  selector: 'nu-generic-toolbar',
  templateUrl: './generic-toolbar.html',
  imports: [
    AuthPermission,
    ConfirmPopupModule,
    RouterModule,
    NgClass,
    UiSvgIcon,
    UiTooltip,
    UiRipple,
  ],
})
export class GenericToolbar {
  readonly #confirmationService = inject(ConfirmationService);

  toolbar = input.required<ToolbarModel>();

  runCommand(targetElement: HTMLButtonElement, tool: ToolModel) {
    if (!tool.confirm) {
      tool.command();
      return;
    }

    this.#confirmationService.confirm({
      key: tool.key,
      target: targetElement as EventTarget,
      message: tool.confirm,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: $localize`Yes`,
      acceptButtonStyleClass: 'ui button danger basic',
      rejectLabel: $localize`No`,
      rejectButtonStyleClass: 'ui button stamp basic',
      accept: () => tool.command(),
    });
  }
}
