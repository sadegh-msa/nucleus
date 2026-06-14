import { inject, Service } from '@angular/core';
import { OperationStatus } from '@nucleus/common';
import { MessageService } from '@nucleus/fabric';
import type { CommonState } from '../models/state.model';

@Service()
export class StoreMessageService {
  readonly #messageService = inject(MessageService);

  commonObserver({ status, message }: CommonState) {
    if (status === OperationStatus.Failure) {
      this.#messageService.addError(message);
    } else if (status === OperationStatus.Success) {
      this.#messageService.addSuccess(message);
    }
  }

  failureObserver({ status, message }: CommonState) {
    if (message.includes('401') && message.includes('Unauthorized')) {
      return;
    }

    if (status === OperationStatus.Failure) {
      this.#messageService.addError(message);
    }
  }
}
