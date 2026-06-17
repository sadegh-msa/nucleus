import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OperationStatus } from '@nucleus/common';
import { catchError, concatMap, map, of } from 'rxjs';
import { formatErrorMessage } from '../../crud/helpers/format-messages.helper'; // Possibility of circular dependency
import type { GenericEntity } from '../../crud/models/generic.model'; // Possibility of circular dependency
import type {
  EffectAddParams,
  EffectDeleteParams,
  EffectGetParams,
  EffectListParams,
  EffectUpdateParams,
} from '../models/effect.model';

export function createListStoreEffect<T extends GenericEntity>({
  actions,
  method,
}: EffectListParams<T>) {
  const actions$ = inject(Actions);

  return createEffect(() =>
    actions$.pipe(
      ofType(actions.list),
      concatMap(({ query }) =>
        method(query).pipe(
          map((response) =>
            actions.listSuccess({
              response,
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) =>
            of(
              actions.listFailure({
                message: formatErrorMessage(error),
                status: OperationStatus.Failure,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}

export function createGetStoreEffect<T extends GenericEntity>({
  config,
  actions,
  method,
}: EffectGetParams<T>) {
  const actions$ = inject(Actions);
  const { title } = config.info;

  return createEffect(() =>
    actions$.pipe(
      ofType(actions.get),
      concatMap(({ query }) => {
        if (!query) {
          return of(
            actions.getFailure({
              message: `ID of ${title} is required`,
              status: OperationStatus.Failure,
            }),
          );
        }

        return method(query).pipe(
          map((response) =>
            actions.getSuccess({
              response,
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) =>
            of(
              actions.getFailure({
                message: formatErrorMessage(error),
                status: OperationStatus.Failure,
              }),
            ),
          ),
        );
      }),
    ),
  );
}

export function createAddStoreEffect<T extends GenericEntity>({
  config,
  actions,
  method,
}: EffectAddParams<T>) {
  const actions$ = inject(Actions);
  const { title } = config.info;

  return createEffect(() =>
    actions$.pipe(
      ofType(actions.add),
      concatMap(({ request }) =>
        method(request).pipe(
          map((response) =>
            actions.addSuccess({
              response,
              message: `${title} added successfully`,
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) =>
            of(
              actions.addFailure({
                message: formatErrorMessage(error),
                status: OperationStatus.Failure,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}

export function createUpdateStoreEffect<T extends GenericEntity>({
  config,
  actions,
  method,
}: EffectUpdateParams<T>) {
  const actions$ = inject(Actions);
  const { title } = config.info;

  return createEffect(() =>
    actions$.pipe(
      ofType(actions.update),
      concatMap(({ query, request }) => {
        if (!query) {
          return of(
            actions.updateFailure({
              message: `ID of ${title} is required`,
              status: OperationStatus.Failure,
            }),
          );
        }

        return method(query, request).pipe(
          map((response) =>
            actions.updateSuccess({
              response,
              message: `${title} updated successfully`,
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) =>
            of(
              actions.updateFailure({
                message: formatErrorMessage(error),
                status: OperationStatus.Failure,
              }),
            ),
          ),
        );
      }),
    ),
  );
}

export function createDeleteStoreEffect<T extends GenericEntity>({
  config,
  actions,
  method,
}: EffectDeleteParams<T>) {
  const actions$ = inject(Actions);
  const { title } = config.info;

  return createEffect(() =>
    actions$.pipe(
      ofType(actions.delete),
      concatMap(({ query }) => {
        if (!query) {
          return of(
            actions.deleteFailure({
              message: `ID of ${title} is required`,
              status: OperationStatus.Failure,
            }),
          );
        }

        return method(query).pipe(
          map(() =>
            actions.deleteSuccess({
              response: { control: {}, data: query },
              message: `${title} deleted successfully`,
              status: OperationStatus.Success,
            }),
          ),
          catchError(({ error }) =>
            of(
              actions.deleteFailure({
                message: formatErrorMessage(error),
                status: OperationStatus.Failure,
              }),
            ),
          ),
        );
      }),
    ),
  );
}
