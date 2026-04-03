import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreMessageService } from '@nucleus/core';
import { type SampleStates, sampleSelectors } from '../store';

@Injectable({
  providedIn: 'root',
})
export class SampleEventHandlerService {
  readonly #storeMessageService = inject(StoreMessageService);
  readonly #sampleStore$ = inject(Store<SampleStates>);

  #handleEvents() {
    this.#sampleStore$
      .pipe(select(sampleSelectors.list.state))
      .subscribe((s) => this.#storeMessageService.failureObserver(s));

    this.#sampleStore$
      .pipe(select(sampleSelectors.get.state))
      .subscribe((s) => this.#storeMessageService.failureObserver(s));

    this.#sampleStore$
      .pipe(select(sampleSelectors.add.state))
      .subscribe((s) => this.#storeMessageService.commonObserver(s));

    this.#sampleStore$
      .pipe(select(sampleSelectors.update.state))
      .subscribe((s) => this.#storeMessageService.commonObserver(s));

    this.#sampleStore$
      .pipe(select(sampleSelectors.delete.state))
      .subscribe((s) => this.#storeMessageService.commonObserver(s));
  }

  register() {
    this.#handleEvents();
  }
}
