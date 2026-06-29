import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OperationStatus } from '@nucleus/common';
import { MessageService } from '@nucleus/fabric';
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
  const messageService = inject(MessageService);

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
          catchError(({ error }) => {
            const message = formatErrorMessage(error);
            messageService.addError(message);

            return of(
              actions.listFailure({
                message,
                status: OperationStatus.Failure,
              }),
            );
          }),
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
  const messageService = inject(MessageService);
  const { title } = config.info;

  return createEffect(() =>
    actions$.pipe(
      ofType(actions.get),
      concatMap(({ query }) => {
        if (!query) {
          const message = $localize`ID of ${title} is required`;
          messageService.addError(message);

          return of(
            actions.getFailure({
              message,
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
          catchError(({ error }) => {
            const message = formatErrorMessage(error);
            messageService.addError(message);

            return of(
              actions.getFailure({
                message,
                status: OperationStatus.Failure,
              }),
            );
          }),
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
  const messageService = inject(MessageService);
  const { title } = config.info;

  return createEffect(() =>
    actions$.pipe(
      ofType(actions.add),
      concatMap(({ request }) =>
        method(request).pipe(
          map((response) => {
            const message = $localize`${title} added successfully`;
            messageService.addSuccess(message);

            return actions.addSuccess({
              message,
              response,
              status: OperationStatus.Success,
            });
          }),
          catchError(({ error }) => {
            const message = formatErrorMessage(error);
            messageService.addError(message);

            return of(
              actions.addFailure({
                message,
                status: OperationStatus.Failure,
              }),
            );
          }),
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
  const messageService = inject(MessageService);
  const { title } = config.info;

  return createEffect(() =>
    actions$.pipe(
      ofType(actions.update),
      concatMap(({ query, request }) => {
        if (!query) {
          const message = $localize`ID of ${title} is required`;
          messageService.addError(message);

          return of(
            actions.updateFailure({
              message,
              status: OperationStatus.Failure,
            }),
          );
        }

        return method(query, request).pipe(
          map((response) => {
            const message = $localize`${title} updated successfully`;
            messageService.addSuccess(message);

            return actions.updateSuccess({
              message,
              response,
              status: OperationStatus.Success,
            });
          }),
          catchError(({ error }) => {
            const message = formatErrorMessage(error);
            messageService.addError(message);

            return of(
              actions.updateFailure({
                message,
                status: OperationStatus.Failure,
              }),
            );
          }),
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
  const messageService = inject(MessageService);
  const { title } = config.info;

  return createEffect(() =>
    actions$.pipe(
      ofType(actions.delete),
      concatMap(({ query }) => {
        if (!query) {
          const message = $localize`ID of ${title} is required`;
          messageService.addError(message);

          return of(
            actions.deleteFailure({
              message,
              status: OperationStatus.Failure,
            }),
          );
        }

        return method(query).pipe(
          map(() => {
            const message = $localize`${title} deleted successfully`;
            messageService.addSuccess(message);

            return actions.deleteSuccess({
              message,
              response: { control: {}, data: query },
              status: OperationStatus.Success,
            });
          }),
          catchError(({ error }) => {
            const message = formatErrorMessage(error);
            messageService.addError(message);

            return of(
              actions.deleteFailure({
                message,
                status: OperationStatus.Failure,
              }),
            );
          }),
        );
      }),
    ),
  );
}
