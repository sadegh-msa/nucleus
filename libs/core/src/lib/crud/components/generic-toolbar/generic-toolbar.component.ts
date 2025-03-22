import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TooltipModule } from 'primeng/tooltip';
import { AuthPermissionDirective } from '../../../auth';
import { ToolElement } from '../../enums/toolbar.enum';
import { NuTool, NuToolbar } from '../../models/toolbar.model';

@Component({

  selector: 'nu-generic-toolbar',
  templateUrl: './generic-toolbar.component.html',
  imports: [
    AuthPermissionDirective,
    ConfirmPopupModule,
    RouterModule,
    TooltipModule,
    NgClass,
    SvgIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericToolbarComponent {
  readonly #confirmationService = inject(ConfirmationService);

  readonly ToolElement = ToolElement;

  toolbar = input.required<NuToolbar>();

  runCommand(event: MouseEvent, tool: NuTool) {
    if (!tool.confirm) {
      tool.command();
      return;
    }

    this.#confirmationService.confirm({
      key: tool.key,
      target: event.target as EventTarget,
      message: tool.confirm,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'fab-button-text fab-button-danger',
      rejectButtonStyleClass: 'fab-button-text fab-button-basic',
      accept: () => tool.command()
    });
  }
}
