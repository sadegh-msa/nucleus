import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type {
  ActionAdd,
  ActionAddSuccess,
  ActionDelete,
  ActionDeleteSuccess,
  ActionFailure,
  ActionGet,
  ActionGetMutate,
  ActionGetSuccess,
  ActionList,
  ActionListSuccess,
  ActionUpdate,
  ActionUpdateSuccess,
} from '../models/action.model';

type Source = typeof createActionGroup.arguments.source;

export function createListStoreActionGroup<Query, Response>(source: Source) {
  return createActionGroup({
    source,
    events: {
      List: props<ActionList<Query>>(),
      'List Success': props<ActionListSuccess<Response>>(),
      'List Failure': props<ActionFailure>(),
      'List Reset': emptyProps(),
    },
  });
}

export function createGetStoreActionGroup<Response>(source: Source) {
  return createActionGroup({
    source,
    events: {
      Get: props<ActionGet>(),
      'Get Mutate': props<ActionGetMutate<Response>>(),
      'Get Success': props<ActionGetSuccess<Response>>(),
      'Get Failure': props<ActionFailure>(),
      'Get Reset': emptyProps(),
    },
  });
}

export function createAddStoreActionGroup<Request, Response>(source: Source) {
  return createActionGroup({
    source,
    events: {
      Add: props<ActionAdd<Request>>(),
      'Add Success': props<ActionAddSuccess<Response>>(),
      'Add Failure': props<ActionFailure>(),
      'Add Reset': emptyProps(),
    },
  });
}

export function createUpdateStoreActionGroup<Request, Response>(source: Source) {
  return createActionGroup({
    source,
    events: {
      Update: props<ActionUpdate<Request>>(),
      'Update Success': props<ActionUpdateSuccess<Response>>(),
      'Update Failure': props<ActionFailure>(),
      'Update Reset': emptyProps(),
    },
  });
}

export function createDeleteStoreActionGroup(source: Source) {
  return createActionGroup({
    source,
    events: {
      Delete: props<ActionDelete>(),
      'Delete Success': props<ActionDeleteSuccess>(),
      'Delete Failure': props<ActionFailure>(),
      'Delete Reset': emptyProps(),
    },
  });
}
