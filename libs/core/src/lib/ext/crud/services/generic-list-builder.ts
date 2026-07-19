import { DestroyRef, effect, Injector, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeObjects, OperationStatus } from '@nucleus/common';
import { filter, pairwise } from 'rxjs';
import { createPagination } from '../creators/pagination.creator';
import { createListToolbar } from '../creators/toolbar.creator';
import { ToolType } from '../enums/toolbar.enum';
import type { GenericEntityModel, GenericListConsumerModel } from '../models/generic.model';
import type { RestListResponseModel } from '../models/rest.model';
import type { NuToolModel } from '../models/toolbar.model';

const DEFAULT_PAGE = 0;
const DEFAULT_ROWS = 10;

@Service({ autoProvided: false })
export class GenericListBuilder<T extends GenericEntityModel> {
  readonly #destroyRef = inject(DestroyRef);
  readonly #injector = inject(Injector);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);

  #consumer!: GenericListConsumerModel<T>;
  #lastQuery = { page: DEFAULT_PAGE, rows: DEFAULT_ROWS };

  init(consumer: GenericListConsumerModel<T>) {
    consumer.pagination = signal(createPagination());
    consumer.data = signal<T['list']>([]);
    consumer.isDataLoading = signal(false);
    consumer.selectedRecords = signal([]);
    consumer.changeSelection = this.#selectionChanged.bind(this);

    this.#consumer = consumer;
  }

  run(createToolbar = true) {
    if (!this.#consumer) {
      throw new Error('It needs to be call "init" method at first!');
    }

    this.#handleConsumerEvents();
    this.#handleLoadDataEvents();
    this.#handleDeleteEvents();
    this.#handleRouterEvents();

    if (createToolbar) {
      this.#consumer.toolbar = this.createToolbar(true);
    }
  }

  #handleRouterEvents() {
    this.#activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((queryParams) => {
        const { page, rows } = queryParams;
        this.#lastQuery = mergeObjects(this.#lastQuery, {
          page: page > 0 ? page - 1 : DEFAULT_PAGE,
          rows: rows > 0 ? rows : DEFAULT_ROWS,
        });

        this.loadData();
      });
  }

  #handleConsumerEvents() {
    const { table, pagination } = this.#consumer;

    toObservable(pagination, { injector: this.#injector })
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        pairwise(),
        filter(([p, c]) => p.page !== c.page || p.rows !== c.rows || p.pages !== c.pages),
      )
      .subscribe(() => this.#updateUrl());

    table.events$?.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(({ tool, payload }) => {
      if (tool.type === ToolType.Delete) {
        this.delete(tool, payload as string);
      }
    });
  }

  #handleLoadDataEvents() {
    effect(
      () => {
        const { response, status, tool } = this.#consumer.store.list();
        tool?.showLoading?.set(status === OperationStatus.InProgress);
        this.#consumer.isDataLoading.set(status === OperationStatus.InProgress);

        if (status === OperationStatus.Success) {
          this.#handleLoadDataResponse(response);
        }
      },
      { injector: this.#injector },
    );
  }

  #handleDeleteEvents() {
    effect(
      () => {
        const { status, tool, query } = this.#consumer.store.delete();
        tool?.showLoading?.set(status === OperationStatus.InProgress ? query : false);

        if (status === OperationStatus.Success) {
          this.loadData();
        }
      },
      { injector: this.#injector },
    );
  }

  #selectionChanged(selectedItems: T['list'] | T['list'][0]) {
    this.#consumer.selectedRecords.set(
      Array.isArray(selectedItems) ? [...selectedItems] : [selectedItems],
    );
  }

  #updateUrl() {
    const { page, rows } = this.#consumer.pagination();

    this.#router
      .navigate([], {
        relativeTo: this.#activatedRoute,
        queryParams: { rows, page: page + 1 },
        queryParamsHandling: 'merge',
        preserveFragment: true,
        replaceUrl: true,
      })
      .then();
  }

  #handleLoadDataResponse(response: RestListResponseModel<T['list']>) {
    const { data } = response;
    // Enable when backend was ready
    // this.#consumer.pagination.update(current => mergeObjects(current, control.pagination));
    this.#consumer.data.set(data);
  }

  createToolbar(attachEventHandler: boolean) {
    const toolbar = createListToolbar<T>(this.#consumer.config, {
      [ToolType.Refresh]: { showLoading: signal(false) },
    });

    if (attachEventHandler) {
      toolbar.events$?.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(({ tool }) => {
        if (tool.type === ToolType.Refresh) {
          this.loadData(tool);
        }
      });
    }

    return toolbar;
  }

  loadData(tool?: NuToolModel) {
    this.#consumer.store.loadList({ ...this.#lastQuery } as any, tool);
  }

  delete(tool: NuToolModel, id: string) {
    if (!tool.showLoading) {
      tool.showLoading = signal(false);
    }

    this.#consumer.store.loadDelete(id, tool);
  }
}
