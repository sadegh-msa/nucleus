import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessageSeverity, MessageSummery } from '../enums/message.enum';

@Injectable({
  providedIn: 'root'
})
export class ScrMessageService {
  readonly #messageService = inject(MessageService);

  showSuccess(detail: string) {
    this.#messageService.add({
      severity: MessageSeverity.Success,
      summary: MessageSummery.Success,
      detail
    });
  }

  showInfo(detail: string) {
    this.#messageService.add({
      severity: MessageSeverity.Info,
      summary: MessageSummery.Info,
      detail
    });
  }

  showWarning(detail: string) {
    this.#messageService.add({
      severity: MessageSeverity.Warn,
      summary: MessageSummery.Warning,
      detail
    });
  }

  showError(detail: string) {
    this.#messageService.add({
      severity: MessageSeverity.Error,
      summary: MessageSummery.Error,
      detail
    });
  }
}
