import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { UiMessageManager } from '@nucleus/ui';
import { formatErrorMessage } from '../helpers/format-messages-helper';
import type {
  AddStateModel,
  CrudRestMethodsModel,
  CrudStoreStateModel,
  DeleteStateModel,
  GetStateModel,
  ListStateModel,
  UpdateStateModel,
} from '../models/signal-store.model';
import type { ToolModel } from '../models/toolbar.model';

function createListInitialState<Query>(): ListStateModel<Query, never> {
  return {
    query: {} as Query,
    response: {
      control: { pagination: { first: 0, page: 0, rows: 10, pages: 0, total: 0 } },
      data: [] as never[],
    },
    message: '',
    status: 'initial',
  };
}

function createGetInitialState<Response>(): GetStateModel<Response> {
  return {
    query: '',
    response: { control: {}, data: {} as Response },
    message: '',
    status: 'initial',
  };
}

function createAddInitialState<Request, Response>(): AddStateModel<Request, Response> {
  return {
    request: {} as Request,
    response: { control: {}, data: {} as Response },
    message: '',
    status: 'initial',
  };
}

function createUpdateInitialState<Request, Response>(): UpdateStateModel<Request, Response> {
  return {
    query: '',
    request: {} as Request,
    response: { control: {}, data: {} as Response },
    message: '',
    status: 'initial',
  };
}

function createDeleteInitialState(): DeleteStateModel {
  return {
    query: '',
    response: { control: {}, data: '' },
    message: '',
    status: 'initial',
  };
}

function createCrudInitialState<Query, Request, Response>(): CrudStoreStateModel<
  Query,
  Request,
  Response
> {
  return {
    list: createListInitialState<Query>(),
    get: createGetInitialState<Response>(),
    add: createAddInitialState<Request, Response>(),
    update: createUpdateInitialState<Request, Response>(),
    delete: createDeleteInitialState(),
  };
}

export function createCrudSignalStore<Query, Request, Response>(
  config: { title: string },
  restFactory: () => CrudRestMethodsModel<Query, Request, Response>,
) {
  return signalStore(
    { providedIn: 'root' },
    withState(() => createCrudInitialState<Query, Request, Response>()),

    withComputed((store) => ({
      listStatus: computed(() => store.list().status),
      listResponse: computed(() => store.list().response),
      getStatus: computed(() => store.get().status),
      getResponse: computed(() => store.get().response),
      addStatus: computed(() => store.add().status),
      addResponse: computed(() => store.add().response),
      updateStatus: computed(() => store.update().status),
      updateResponse: computed(() => store.update().response),
      deleteStatus: computed(() => store.delete().status),
      deleteResponse: computed(() => store.delete().response),
    })),

    withMethods((store) => {
      const uiMessageManager = inject(UiMessageManager);
      const rest = restFactory();

      return {
        loadList(query: Query, tool?: ToolModel) {
          patchState(store, {
            list: { ...store.list(), query, tool, status: 'inProgress' },
          });
          rest.list(query).subscribe({
            next: (response) => {
              patchState(store, {
                list: { ...store.list(), response, tool, status: 'success' },
              });
            },
            error: ({ error }: { error: any }) => {
              const message = formatErrorMessage(error);
              uiMessageManager.addError(message);
              patchState(store, {
                list: { ...store.list(), message, tool, status: 'failure' },
              });
            },
          });
        },

        loadGet(query: string, tool?: ToolModel) {
          if (!query) {
            const message = $localize`ID of ${config.title} is required`;
            uiMessageManager.addError(message);
            patchState(store, {
              get: { ...store.get(), message, status: 'failure' },
            });
            return;
          }

          patchState(store, {
            get: { ...store.get(), query, tool, status: 'inProgress' },
          });
          rest.get(query).subscribe({
            next: (response) => {
              patchState(store, {
                get: { ...store.get(), response, tool, status: 'success' },
              });
            },
            error: ({ error }: { error: any }) => {
              const message = formatErrorMessage(error);
              uiMessageManager.addError(message);
              patchState(store, {
                get: { ...store.get(), message, tool, status: 'failure' },
              });
            },
          });
        },

        loadAdd(request: Request, tool?: ToolModel) {
          patchState(store, {
            add: { ...store.add(), request, tool, status: 'inProgress' },
          });
          rest.add(request).subscribe({
            next: (response) => {
              const message = $localize`${config.title} added successfully`;
              uiMessageManager.addSuccess(message);
              patchState(store, {
                add: { ...store.add(), response, message, tool, status: 'success' },
              });
            },
            error: ({ error }: { error: any }) => {
              const message = formatErrorMessage(error);
              uiMessageManager.addError(message);
              patchState(store, {
                add: { ...store.add(), message, tool, status: 'failure' },
              });
            },
          });
        },

        loadUpdate(query: string, request: Request, tool?: ToolModel) {
          if (!query) {
            const message = $localize`ID of ${config.title} is required`;
            uiMessageManager.addError(message);
            patchState(store, {
              update: { ...store.update(), message, status: 'failure' },
            });
            return;
          }

          patchState(store, {
            update: { ...store.update(), query, request, tool, status: 'inProgress' },
          });
          rest.update(query, request).subscribe({
            next: (response) => {
              const message = $localize`${config.title} updated successfully`;
              uiMessageManager.addSuccess(message);
              patchState(store, {
                update: {
                  ...store.update(),
                  response,
                  message,
                  tool,
                  status: 'success',
                },
              });
            },
            error: ({ error }: { error: any }) => {
              const message = formatErrorMessage(error);
              uiMessageManager.addError(message);
              patchState(store, {
                update: { ...store.update(), message, tool, status: 'failure' },
              });
            },
          });
        },

        loadDelete(query: string, tool?: ToolModel) {
          if (!query) {
            const message = $localize`ID of ${config.title} is required`;
            uiMessageManager.addError(message);
            patchState(store, {
              delete: { ...store.delete(), message, status: 'failure' },
            });
            return;
          }

          patchState(store, {
            delete: { ...store.delete(), query, tool, status: 'inProgress' },
          });
          rest.delete(query).subscribe({
            next: (response) => {
              const message = $localize`${config.title} deleted successfully`;
              uiMessageManager.addSuccess(message);
              patchState(store, {
                delete: {
                  ...store.delete(),
                  response,
                  message,
                  tool,
                  status: 'success',
                },
              });
            },
            error: ({ error }: { error: any }) => {
              const message = formatErrorMessage(error);
              uiMessageManager.addError(message);
              patchState(store, {
                delete: { ...store.delete(), message, tool, status: 'failure' },
              });
            },
          });
        },

        mutateGet(response: Response) {
          patchState(store, {
            get: {
              ...store.get(),
              response: { control: {}, data: response },
              status: 'initial',
            },
          });
        },

        resetList() {
          patchState(store, { list: createListInitialState<Query>() });
        },
        resetGet() {
          patchState(store, { get: createGetInitialState<Response>() });
        },
        resetAdd() {
          patchState(store, { add: createAddInitialState<Request, Response>() });
        },
        resetUpdate() {
          patchState(store, { update: createUpdateInitialState<Request, Response>() });
        },
        resetDelete() {
          patchState(store, { delete: createDeleteInitialState() });
        },
        resetAll() {
          patchState(store, createCrudInitialState<Query, Request, Response>());
        },
      };
    }),
  );
}
