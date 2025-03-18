import { inject, Injectable } from '@angular/core';
import { ScrMessageService, OperationStatus } from '../../common';
import { CommonState } from '../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class StoreMessageService {
  readonly #scrMessageService = inject(ScrMessageService);

  commonObserver({ status, message }: CommonState) {
    if (status === OperationStatus.Failure) {
      this.#scrMessageService.showError(message);
    } else if (status === OperationStatus.Success) {
      this.#scrMessageService.showSuccess(message);
    }
  };

  failureObserver({ status, message }: CommonState) {
    if (message.includes('401') && message.includes('Unauthorized')) {
      return;
    }

    if (status === OperationStatus.Failure) {
      this.#scrMessageService.showError(message);
    }
  };
}
