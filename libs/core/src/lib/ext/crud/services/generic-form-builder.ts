import { computed, DestroyRef, effect, Injector, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
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
    consumer.title = signal(this.#getCurrentTitle());
    consumer.isSubmitting = signal(false);
    consumer.isSubmitted = signal(false);
    consumer.save = this.save.bind(this);
    consumer.formControlHasError = this.formControlHasError.bind(this);

    this.#consumer = consumer;
  }

  run(createToolbar = true) {
    if (!this.#consumer) {
      throw new Error('It needs to call "init" method first!');
    }

    const { pageType, form } = this.#consumer;

    this.#loadNavigationState();
    this.#handleConsumerEvents();
    this.#handleSaveEvents();
    this.#handleDeleteEvents();

    if (pageType() !== 'add') {
      if (pageType() === 'view') {
        form.disable();
      }

      this.#handleLoadDataEvents();
      this.loadData();
    }

    if (createToolbar) {
      this.#consumer.toolbar = this.createToolbar(true);
    }
  }

  #handleConsumerEvents() {
    const { config, pageType, title, data, form } = this.#consumer;
    const toObservableOptions = { injector: this.#injector };

    if (pageType() !== 'add') {
      toObservable(title, toObservableOptions)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => this.#updateNavigationState());
    }

    toObservable(data, toObservableOptions)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((response) => {
        title.set(response[config.field.title as keyof T['full']] as string);
        form.patchValue(response as typeof form.value);
      });
  }

  #handleLoadDataEvents() {
    const { store, data, isSubmitting } = this.#consumer;

    effect(
      () => {
        const { status, response, tool } = store.get();
        isSubmitting.set(status === 'inProgress');
        tool?.showLoading?.set(status === 'inProgress');

        data.set(response.data);
      },
      { injector: this.#injector },
    );
  }

  #handleSaveEvents() {
    const { store, isSubmitting, isEmbedded } = this.#consumer;

    store.resetAdd();
    store.resetUpdate();

    effect(
      () => {
        const addState = store.add();
        const updateState = store.update();

        // Check which one is in progress
        const active = [addState, updateState].find(
          (s) => s.status === 'inProgress' || s.status === 'success',
        );

        if (!active) return;

        isSubmitting.set(active.status === 'inProgress');
        active.tool?.showLoading?.set(active.status === 'inProgress');

        if (!isEmbedded && active.status === 'success') {
          const response = (active as any).response?.data;
          store.getMutate(response);
          this.navigateToViewPage({ saved: true });
        }
      },
      { injector: this.#injector },
    );
  }

  #handleDeleteEvents() {
    const { store, isSubmitting, isEmbedded } = this.#consumer;

    store.resetDelete();

    effect(
      () => {
        const { status, tool } = store.delete();
        isSubmitting.set(status === 'inProgress');
        tool?.showLoading?.set(status === 'inProgress');

        if (!isEmbedded && status === 'success') {
          this.navigateToListPage();
        }
      },
      { injector: this.#injector },
    );
  }

  #loadNavigationState() {
    this.#consumer.navigationState = window.history.state;
  }

  #setNavigationState(state: RouterStateModel) {
    const historyState = window.history.state || {};
    window.history.replaceState({ ...historyState, ...state }, '', this.#router.url);
  }

  #updateNavigationState() {
    const { isEmbedded, title } = this.#consumer;

    if (isEmbedded()) {
      return;
    }

    this.#setNavigationState({ title: title() });
  }

  #getCurrentTitle() {
    return (window.history.state || {})['title'] || '...';
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
          ['cancel']: viewExtra,
        });
        break;

      case 'view':
        toolbar = createViewToolbar<T>(config, {
          ['edit']: viewExtra,
        });
        break;
    }

    if (attachEventHandler) {
      toolbar?.events$?.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(({ tool }) => {
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
    const request = { ...form.value, [config.field.id]: undefined } as T['add'];

    store.loadAdd(request, tool);
  }

  update(tool?: ToolModel) {
    const { form, store, id } = this.#consumer;
    const request = form.value as T['update'];

    store.loadUpdate(id(), request, tool);
  }

  delete(tool?: ToolModel) {
    const { store, id } = this.#consumer;

    store.loadDelete(id(), tool);
  }

  save(tool?: ToolModel) {
    const { isSubmitted, form, pageType } = this.#consumer;

    isSubmitted.set(true);
    form.markAllAsTouched();

    if (form.invalid) {
      return;
    }

    if (pageType() === 'add') {
      this.add(tool);
    } else if (pageType() === 'edit') {
      this.update(tool);
    }
  }

  navigateToListPage() {
    this.#router.navigate(this.#consumer.config.path.page.list()).then();
  }

  navigateToViewPage(state?: RouterStateModel) {
    const { config, id, title } = this.#consumer;

    this.#router
      .navigate(config.path.page.view(id()), {
        state: { title: title(), ...(state && { ...state }) },
      })
      .then();
  }

  formControlHasError(controlName: string, error: string) {
    const { isSubmitted, form } = this.#consumer;

    return isSubmitted() && form.get(controlName)?.hasError(error);
  }
}
