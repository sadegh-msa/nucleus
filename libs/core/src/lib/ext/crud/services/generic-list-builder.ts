import { DestroyRef, effect, Injector, inject, Service, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { equals, mergeAll } from '@nucleus/common';
import { filter, map, pairwise } from 'rxjs';
import { crudInternalConfig } from '../../../int/crud/configs';
import { createPagination } from '../factory/pagination-factory';
import { createListToolbar } from '../factory/toolbar-factory';
import type { GenericEntityModel, GenericListConsumerModel } from '../models/generic.model';
import type { ToolModel } from '../models/toolbar.model';

const paginationConfig = crudInternalConfig.pagination;

@Service({ autoProvided: false })
export class GenericListBuilder<T extends GenericEntityModel> {
  readonly #destroyRef = inject(DestroyRef);
  readonly #injector = inject(Injector);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);

  #consumer!: GenericListConsumerModel<T>;
  #lastQuery = { page: paginationConfig.page, rows: paginationConfig.rows };

  init(consumer: GenericListConsumerModel<T>) {
    consumer.pagination = signal(createPagination());
    consumer.data = signal<T['list']>([]);
    consumer.isBusy = signal(false);
    consumer.selectedRecords = signal([]);
    consumer.changeSelection = this.#selectionChanged.bind(this);

    this.#consumer = consumer;
  }

  run(createToolbar = true) {
    if (!this.#consumer) {
      throw new Error('It needs to call "init" method first!');
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
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        map(({ page, rows }) => ({ page: Number(page), rows: Number(rows) })),
      )
      .subscribe((queryParams) => {
        const { page, rows } = queryParams;
        this.#lastQuery = mergeAll(this.#lastQuery, {
          page: page > 0 ? page - 1 : paginationConfig.page,
          rows: rows > 0 ? rows : paginationConfig.rows,
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
        filter(([p, c]) => !equals(p, c)),
      )
      .subscribe(() => this.#updateUrl());

    table.events$
      ?.pipe(takeUntilDestroyed(this.#destroyRef)) //
      .subscribe(({ tool, payload }) => {
        if (tool.type === 'delete') {
          this.delete(tool, payload as string);
        }
      });
  }

  #handleLoadDataEvents() {
    effect(
      () => {
        const { response, status, tool } = this.#consumer.store.list();

        untracked(() => {
          tool?.showLoading?.set(status === 'inProgress');
          this.#consumer.isBusy.set(status === 'inProgress');

          if (status === 'success') {
            this.#consumer.data.set(response.data);
            this.#consumer.pagination.set(response.control.pagination);
          }
        });
      },
      { injector: this.#injector },
    );
  }

  #handleDeleteEvents() {
    const { store } = this.#consumer;

    store.resetDelete();

    effect(
      () => {
        const { status, tool, query } = this.#consumer.store.delete();

        untracked(() => {
          tool?.showLoading?.set(status === 'inProgress' ? query : false);

          if (status === 'success') {
            store.resetDelete();
            this.loadData();
          }
        });
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

  createToolbar(attachEventHandler: boolean) {
    const toolbar = createListToolbar<T>(this.#consumer.config, {
      'refresh': { showLoading: signal(false) },
    });

    if (attachEventHandler) {
      toolbar.events$?.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(({ tool }) => {
        if (tool.type === 'refresh') {
          this.loadData(tool);
        }
      });
    }

    return toolbar;
  }

  loadData(tool?: ToolModel) {
    this.#consumer.store.loadList({ ...this.#lastQuery } as any, tool);
  }

  delete(tool: ToolModel, id: string) {
    if (!tool.showLoading) {
      tool.showLoading = signal(false);
    }

    this.#consumer.store.loadDelete(id, tool);
  }
}
