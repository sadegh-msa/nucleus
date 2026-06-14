import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SvgIconDirective, TooltipDirective } from '@nucleus/fabric';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AuthPermissionDirective } from '../../../auth';
import { ToolElement } from '../../enums/toolbar.enum';
import type { NuTool, NuToolbar } from '../../models/toolbar.model';

@Component({
  selector: 'nu-generic-toolbar',
  templateUrl: './generic-toolbar.component.html',
  imports: [
    AuthPermissionDirective,
    ConfirmPopupModule,
    RouterModule,
    NgClass,
    SvgIconDirective,
    TooltipDirective
  ],
})
export class GenericToolbarComponent {
  readonly #confirmationService = inject(ConfirmationService);

  readonly ToolElement = ToolElement;

  toolbar = input.required<NuToolbar>();

  runCommand(targetElement: HTMLButtonElement, tool: NuTool) {
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
      acceptButtonStyleClass: 'fab button danger basic',
      rejectLabel: $localize`No`,
      rejectButtonStyleClass: 'fab button stamp basic',
      accept: () => tool.command(),
    });
  }
}
