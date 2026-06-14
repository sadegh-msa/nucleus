import { inject, Service } from '@angular/core';
import type { EffectNotification, OnRunEffects } from '@ngrx/effects';
import {
  AuthOnRunEffect,
  createAddStoreEffect,
  createDeleteStoreEffect,
  createGetStoreEffect,
  createListStoreEffect,
  createUpdateStoreEffect
} from '@nucleus/core';
import type { Observable } from 'rxjs';
import type { SampleGeneric } from '../models/sample-generic.model';
import { sampleConfig } from '../sample.config';
import { SampleRestService } from '../services/sample-rest.service';
import { sampleActions } from './sample.actions';

@Service({ autoProvided: false })
export class SampleEffects implements OnRunEffects {
  readonly #sampleRestService = inject(SampleRestService);
  readonly #authOnRunEffect = inject(AuthOnRunEffect);
  readonly #commonArgs = { config: sampleConfig, actions: sampleActions };

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.#authOnRunEffect.ngrxOnRunEffects(resolvedEffects$);
  }

  list$ = createListStoreEffect<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.list,
  });
  get$ = createGetStoreEffect<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.get,
  });
  add$ = createAddStoreEffect<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.add,
  });
  update$ = createUpdateStoreEffect<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.update,
  });
  delete$ = createDeleteStoreEffect<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.delete,
  });
}
