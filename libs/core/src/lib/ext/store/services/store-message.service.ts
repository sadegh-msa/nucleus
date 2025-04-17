import { inject, Injectable } from '@angular/core';
import { NuMessageService, OperationStatus } from '@nucleus/common';
import { CommonState } from '../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class StoreMessageService {
  readonly #nuMessageService = inject(NuMessageService);

  commonObserver({ status, message }: CommonState) {
    if (status === OperationStatus.Failure) {
      this.#nuMessageService.showError(message);
    } else if (status === OperationStatus.Success) {
      this.#nuMessageService.showSuccess(message);
    }
  };

  failureObserver({ status, message }: CommonState) {
    if (message.includes('401') && message.includes('Unauthorized')) {
      return;
    }

    if (status === OperationStatus.Failure) {
      this.#nuMessageService.showError(message);
    }
  };
}
