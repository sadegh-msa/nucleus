import { effect, Injector, inject, Service, signal } from '@angular/core';
import { OperationStatus } from '@nucleus/common';
import type { DropdownData } from '../models/dropdown.model';
import type { CrudStore } from '../models/generic.model';
import type { ValueLabel } from '../models/pair.model';

@Service({ autoProvided: false })
export class DropdownDataService {
  readonly #injector = inject(Injector);

  load(store: CrudStore, selector: 'list' | 'get' | 'add' | 'update' | 'delete'): DropdownData {
    const options = signal<ValueLabel[]>([]);
    const icon = signal<string>('pi pi-angle-down');

    effect(
      () => {
        const state = store[selector]();
        const { status, response } = state as any;
        icon.set(
          status === OperationStatus.InProgress ? 'pi pi-spin pi-spinner' : 'pi pi-angle-down',
        );
        options.set(response);
      },
      { injector: this.#injector },
    );

    return {
      options: options.asReadonly(),
      icon: icon.asReadonly(),
    };
  }
}
