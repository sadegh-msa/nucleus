import { effect, Injector, inject, Service, signal } from '@angular/core';
import type { DropdownDataModel } from '../models/dropdown.model';
import type { CrudStoreModel } from '../models/generic.model';
import type { ValueLabelModel } from '../models/pair.model';

@Service({ autoProvided: false })
export class DropdownData {
  readonly #injector = inject(Injector);

  load(
    store: CrudStoreModel,
    selector: 'list' | 'get' | 'add' | 'update' | 'delete',
  ): DropdownDataModel {
    const options = signal<ValueLabelModel[]>([]);
    const icon = signal<string>('pi pi-angle-down');

    effect(
      () => {
        const state = store[selector]();
        const { status, response } = state as any;
        icon.set(status === 'inProgress' ? 'pi pi-spin pi-spinner' : 'pi pi-angle-down');
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
