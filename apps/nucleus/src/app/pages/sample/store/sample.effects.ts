import { inject, Injectable } from '@angular/core';
import { EffectNotification, OnRunEffects } from '@ngrx/effects';
import { AuthOnRunEffect, StoreEffectCreator } from '@nucleus/core';
import { Observable } from 'rxjs';
import { SampleGeneric } from '../models/sample-generic.model';
import { sampleConfig } from '../sample.config';
import { SampleRestService } from '../services/sample-rest.service';
import { sampleActions } from './sample.actions';

@Injectable()
export class SampleEffects implements OnRunEffects {
  readonly #sampleRestService = inject(SampleRestService);
  readonly #authOnRunEffect = inject(AuthOnRunEffect);
  readonly #commonArgs = { config: sampleConfig, actions: sampleActions };

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.#authOnRunEffect.ngrxOnRunEffects(resolvedEffects$);
  }

  list$ = StoreEffectCreator.createList<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.list,
  });
  get$ = StoreEffectCreator.createGet<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.get,
  });
  add$ = StoreEffectCreator.createAdd<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.add,
  });
  update$ = StoreEffectCreator.createUpdate<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.update,
  });
  delete$ = StoreEffectCreator.createDelete<SampleGeneric>({
    ...this.#commonArgs,
    method: this.#sampleRestService.delete,
  });
}

