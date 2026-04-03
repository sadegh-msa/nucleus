import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type Store, select } from '@ngrx/store';
import { OperationStatus } from '@nucleus/common';
import type { DropdownData } from '../models/dropdown.model';
import type { ValueLabel } from '../models/pair.model';

@Injectable({
  providedIn: 'any',
})
export class DropdownDataService {
  readonly #destroyRef = inject(DestroyRef);

  load(store$: Store<any>, selector: any): DropdownData {
    const options = signal<ValueLabel[]>([]);
    const icon = signal<string>('pi pi-angle-down');

    store$
      .pipe(select(selector), takeUntilDestroyed(this.#destroyRef))
      .subscribe(({ status, response }) => {
        icon.set(
          status === OperationStatus.InProgress ? 'pi pi-spin pi-spinner' : 'pi pi-angle-down',
        );
        options.set(response);
      });

    return {
      options: options.asReadonly(),
      icon: icon.asReadonly(),
    };
  }
}
