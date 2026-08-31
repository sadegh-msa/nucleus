import {
  computed,
  DestroyRef,
  effect,
  Injector,
  inject,
  linkedSignal,
  Service,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { isNotEmpty, patchExisting } from '@nucleus/common';
import { createAddToolbar, createEditToolbar, createViewToolbar } from '../factory/toolbar-factory';
import type { GenericEntityModel, GenericFormConsumerModel } from '../models/generic.model';
import type { RouterStateModel } from '../models/router.model';
import type { ToolbarModel, ToolModel } from '../models/toolbar.model';

@Service({ autoProvided: false })
export class GenericFormBuilder<T extends GenericEntityModel> {
  readonly #destroyRef = inject(DestroyRef);
  readonly #injector = inject(Injector);
  readonly #router = inject(Router);

  #consumer!: GenericFormConsumerModel<T>;

  init(consumer: GenericFormConsumerModel<T>) {
    consumer.data = signal<T['full']>({});
    consumer.id = linkedSignal(() => consumer.inputId());
    consumer.title = signal(this.#getStateTitle());
    consumer.isBusy = signal(false);
    consumer.onSubmit = this.onSubmit.bind(this);

    this.#consumer = consumer;
  }

  run(createToolbar = true) {
    if (!this.#consumer) {
      throw new Error('It needs to call "init" method first!');
    }

    const { pageType } = this.#consumer;

    this.#loadNavigationState();
    this.#handleConsumerEvents();
    this.#handleSaveEvents();
    this.#handleDeleteEvents();

    if (pageType() !== 'add') {
      this.#handleLoadDataEvents();
      this.loadData();
    }

    if (createToolbar) {
      this.#consumer.toolbar = this.createToolbar(true);
    }
  }

  #handleConsumerEvents() {
    const { pageType, title, data } = this.#consumer;
    const effectOptions = { injector: this.#injector };

    if (pageType() !== 'add') {
      effect(() => {
        title();
        untracked(() => this.#updateNavigationState());
      }, effectOptions);
    }

    effect(() => {
      const dataValue = data();

      untracked(() => {
        if (isNotEmpty(dataValue)) {
          this.updateId(dataValue);
          this.updateTitle(dataValue);
          this.patchFormValue(dataValue);
        }
      });
    }, effectOptions);
  }

  #handleLoadDataEvents() {
    const { store, data, isBusy } = this.#consumer;

    effect(
      () => {
        const { status, response, tool } = store.get();

        if (Object.keys(response.data ?? {}).length) {
          untracked(() => {
            isBusy.set(status === 'inProgress');
            tool?.showLoading?.set(isBusy());

            data.set(response.data);
          });
        }
      },
      { injector: this.#injector },
    );
  }

  #handleSaveEvents() {
    const { store, isBusy, isEmbedded } = this.#consumer;

    store.resetAdd();
    store.resetUpdate();

    effect(
      () => {
        const addState = store.add();
        const updateState = store.update();

        untracked(() => {
          const active = [addState, updateState].find((s) =>
            ['inProgress', 'success'].includes(s.status),
          );

          if (!active) return;

          isBusy.set(active.status === 'inProgress');
          active.tool?.showLoading?.set(isBusy());

          if (!isEmbedded() && active.status === 'success') {
            const data = (active as any).response?.data;
            const id = this.fetchIdValue(data);
            const title = this.fetchTitleValue(data);

            store.mutateGet(data);
            this.navigateToViewPage(id, { title, saved: true });
          }
        });
      },
      { injector: this.#injector },
    );
  }

  #handleDeleteEvents() {
    const { store, isBusy, isEmbedded } = this.#consumer;

    store.resetDelete();

    effect(
      () => {
        const { status, tool } = store.delete();

        untracked(() => {
          isBusy.set(status === 'inProgress');
          tool?.showLoading?.set(isBusy());

          if (!isEmbedded() && status === 'success') {
            store.resetDelete();
            this.navigateToListPage();
          }
        });
      },
      { injector: this.#injector },
    );
  }

  #loadNavigationState() {
    this.#consumer.navigationState = window.history.state;
  }

  #setNavigationState(state: RouterStateModel) {
    const historyState = window.history.state ?? {};
    window.history.replaceState({ ...historyState, ...state }, '', this.#router.url);
  }

  #updateNavigationState() {
    const { isEmbedded, title } = this.#consumer;

    if (isEmbedded()) {
      return;
    }

    this.#setNavigationState({ title: title() });
  }

  #getStateTitle() {
    return (window.history.state ?? {})['title'] ?? '...';
  }

  fetchIdValue(data: T['full']) {
    const { config } = this.#consumer;
    return data[config.field.id as keyof T['full']] as string;
  }

  fetchTitleValue(data: T['full']) {
    const { config } = this.#consumer;
    return data[config.field.title as keyof T['full']] as string;
  }

  updateId(data: T['full']) {
    this.#consumer.id.set(this.fetchIdValue(data));
  }

  updateTitle(data: T['full']) {
    this.#consumer.title.set(this.fetchTitleValue(data));
  }

  patchFormValue(value: T['form']) {
    this.#consumer.formModel.update((currentValue) => {
      return patchExisting<T['form']>(currentValue, value);
    });
  }

  createToolbar(attachEventHandler: boolean) {
    const { pageType, config, id, data } = this.#consumer;
    const viewExtra = {
      id: computed(() => id()),
      routerStates: computed(() => {
        return { title: data()[config.field.title as keyof T['full']] };
      }),
    };
    let toolbar: ToolbarModel = { tools: [] };

    switch (pageType()) {
      case 'add':
        toolbar = createAddToolbar<T>(config);
        break;

      case 'edit':
        toolbar = createEditToolbar<T>(config, {
          cancel: viewExtra,
        });
        break;

      case 'view':
        toolbar = createViewToolbar<T>(config, {
          edit: viewExtra,
        });
        break;
    }

    if (attachEventHandler) {
      toolbar?.events$
        ?.pipe(takeUntilDestroyed(this.#destroyRef)) //
        .subscribe(({ tool }) => {
          switch (tool.type) {
            case 'save':
              this.save(tool);
              break;

            case 'refresh':
              this.loadData(tool);
              break;

            case 'delete':
              this.delete(tool);
              break;
          }
        });
    }

    return toolbar;
  }

  loadData(tool?: ToolModel) {
    const { pageType, store, id, navigationState } = this.#consumer;

    if (pageType() === 'add') {
      return;
    }

    if (navigationState?.['saved']) {
      this.#setNavigationState({ saved: false });
      return;
    }

    store.resetGet();
    store.loadGet(id(), tool);
  }

  add(tool?: ToolModel) {
    const { form, config, store } = this.#consumer;
    const request = { ...form().value(), [config.field.id]: undefined } as T['add'];

    store.loadAdd(request, tool);
  }

  update(tool?: ToolModel) {
    const { form, store, id } = this.#consumer;
    const request = form().value() as T['update'];

    store.loadUpdate(id(), request, tool);
  }

  delete(tool?: ToolModel) {
    const { store, id } = this.#consumer;

    store.loadDelete(id(), tool);
  }

  save(tool?: ToolModel) {
    const { form, pageType } = this.#consumer;

    form().markAsTouched();

    if (form().invalid()) {
      return;
    }

    if (pageType() === 'add') {
      this.add(tool);
    } else if (pageType() === 'edit') {
      this.update(tool);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.save();
  }

  navigateToListPage() {
    this.#router.navigate(this.#consumer.config.path.page.list()).then();
  }

  navigateToViewPage(id: string, state: RouterStateModel) {
    const { config } = this.#consumer;
    this.#router.navigate(config.path.page.view(id), { state }).then();
  }
}
