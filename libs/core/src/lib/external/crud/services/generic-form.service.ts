import { computed, DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, debounceTime, mergeAll } from 'rxjs';
import { OperationStatus } from '@nucleus/common';
import { ToolbarCreator } from '../creators/toolbar.creator';
import { PageType } from '../enums/page.enum';
import { RouterStateKey } from '../enums/router-state.enum';
import { ToolType } from '../enums/toolbar.enum';
import { GenericEntity, GenericFormConsumer } from '../models/generic.model';
import { NuTool, NuToolbar } from '../models/toolbar.model';


@Injectable()
export class GenericFormService<T extends GenericEntity> {
  readonly #destroyRef = inject(DestroyRef);
  readonly #injector = inject(Injector);
  readonly #router = inject(Router);
  readonly #store$ = inject(Store<T['store']['states']>);

  #consumer!: GenericFormConsumer<T>;

  init(consumer: GenericFormConsumer<T>) {
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
      throw new Error('It needs to be call "init" method at first!');
    }

    const { pageType, form } = this.#consumer;

    this.#loadNavigationState();
    this.#handleConsumerEvents();
    this.#handleSaveEvents();
    this.#handleDeleteEvents();

    if (pageType !== PageType.Add) {
      if (pageType === PageType.View) {
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

    if (pageType !== PageType.Add) {
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

    this.#store$.pipe(
      select(store.selectors.get.state),
      debounceTime(0),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(({ status, response, tool }) => {
      isSubmitting.set(status === OperationStatus.InProgress);
      tool?.showLoading?.set(status === OperationStatus.InProgress);

      data.set(response.data);
    });
  }

  #handleSaveEvents() {
    const { store, isSubmitting, isEmbedded } = this.#consumer;

    this.#store$.dispatch(store.actions.addReset());
    this.#store$.dispatch(store.actions.updateReset());

    combineLatest([
      this.#store$.pipe(select(store.selectors.add.state)),
      this.#store$.pipe(select(store.selectors.update.state))
    ]).pipe(
      mergeAll(1),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(({ status, response, tool }) => {
      isSubmitting.set(status === OperationStatus.InProgress);
      tool?.showLoading?.set(status === OperationStatus.InProgress);

      if (!isEmbedded && status === OperationStatus.Success) {
        this.#store$.dispatch(store.actions.getMutate({ request: response }));
        this.navigateToViewPage({ [RouterStateKey.Saved]: true });
      }
    });
  }

  #handleDeleteEvents() {
    const { store, isSubmitting, isEmbedded } = this.#consumer;

    this.#store$.dispatch(store.actions.deleteReset());

    this.#store$.pipe(
      select(store.selectors.delete.state),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(({ status, tool }) => {
      isSubmitting.set(status === OperationStatus.InProgress);
      tool?.showLoading?.set(status === OperationStatus.InProgress);

      if (!isEmbedded && status === OperationStatus.Success) {
        this.navigateToListPage();
      }
    });
  }

  #loadNavigationState() {
    this.#consumer.navigationState = window.history.state;
  }

  #setNavigationState(key: string, value?: unknown) {
    const state = window.history.state || {};
    window.history.replaceState({ ...state, [key]: value }, '', this.#router.url);
  }

  #updateNavigationState() {
    const { isEmbedded, title } = this.#consumer;

    if (isEmbedded) {
      return;
    }

    this.#setNavigationState(RouterStateKey.Title, title());
  }

  #getCurrentTitle() {
    const state = window.history.state || {};

    return state[RouterStateKey.Title] || '...';
  }

  createToolbar(attachEventHandler: boolean) {
    const { pageType, config, id, data } = this.#consumer;
    const viewExtra = {
      id: computed(() => id),
      routerStates: computed(() => {
        return { [RouterStateKey.Title]: data()[config.field.title as keyof T['full']] };
      })
    };
    let toolbar: NuToolbar = { tools: [] };

    switch (pageType) {
      case PageType.Add:
        toolbar = ToolbarCreator.createAddTools<T>(config);
        break;

      case PageType.Edit:
        toolbar = ToolbarCreator.createEditTools<T>(config, {
          [ToolType.Cancel]: viewExtra
        });
        break;

      case PageType.View:
        toolbar = ToolbarCreator.createViewTools<T>(config, {
          [ToolType.Edit]: viewExtra
        });
        break;
    }

    if (attachEventHandler) {
      toolbar?.events$?.pipe(
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe(({ tool }) => {
        switch (tool.type) {
          case ToolType.Save:
            this.save(tool);
            break;

          case ToolType.Refresh:
            this.loadData(tool);
            break;

          case ToolType.Delete:
            this.delete(tool);
            break;
        }
      });
    }

    return toolbar;
  }

  loadData(tool?: NuTool) {
    const { pageType, store, id, navigationState } = this.#consumer;

    if (pageType === PageType.Add) {
      return;
    }

    if (navigationState && navigationState[RouterStateKey.Saved]) {
      this.#setNavigationState(RouterStateKey.Saved, false);
      return;
    }

    this.#store$.dispatch(store.actions.getReset());
    this.#store$.dispatch(store.actions.get({ query: id, tool }));
  }

  add(tool?: NuTool) {
    const { form, config, store } = this.#consumer;
    const request = { ...form.value, [config.field.id]: undefined } as T['add'];

    this.#store$.dispatch(store.actions.add({ request, tool }));
  }

  update(tool?: NuTool) {
    const { form, store, id } = this.#consumer;
    const request = form.value as T['update'];

    this.#store$.dispatch(store.actions.update({ query: id, request, tool }));
  }

  delete(tool?: NuTool) {
    const { store, id } = this.#consumer;

    this.#store$.dispatch(store.actions.delete({ query: id, tool }));
  }

  save(tool?: NuTool) {
    const { isSubmitted, form, pageType } = this.#consumer;

    isSubmitted.set(true);
    form.markAllAsTouched();

    if (form.invalid) {
      return;
    }

    if (pageType === PageType.Add) {
      this.add(tool);
    } else if (pageType === PageType.Edit) {
      this.update(tool);
    }
  }

  navigateToListPage() {
    this.#router.navigate(this.#consumer.config.path.page.list()).then();
  }

  navigateToViewPage(state?: Record<string, unknown>) {
    const { config, id, title } = this.#consumer;

    this.#router.navigate(
      config.path.page.view(id),
      { state: { [RouterStateKey.Title]: title(), ...(state && { ...state }) } }
    ).then();
  }

  formControlHasError(controlName: string, error: string) {
    const { isSubmitted, form } = this.#consumer;

    return isSubmitted() && form.get(controlName)?.hasError(error);
  }
}
