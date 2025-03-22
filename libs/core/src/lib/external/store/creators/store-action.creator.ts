import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
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
  ActionUpdateSuccess
} from '../models/action.model';

type Source = typeof createActionGroup.arguments.source

export class StoreActionCreator {
  static createListGroup<Query, Response>(source: Source) {
    return createActionGroup({
      source,
      events: {
        'List': props<ActionList<Query>>(),
        'List Success': props<ActionListSuccess<Response>>(),
        'List Failure': props<ActionFailure>(),
        'List Reset': emptyProps()
      }
    });
  }

  static createGetGroup<Response>(source: Source) {
    return createActionGroup({
      source,
      events: {
        'Get': props<ActionGet>(),
        'Get Mutate': props<ActionGetMutate<Response>>(),
        'Get Success': props<ActionGetSuccess<Response>>(),
        'Get Failure': props<ActionFailure>(),
        'Get Reset': emptyProps()
      }
    });
  }

  static createAddGroup<Request, Response>(source: Source) {
    return createActionGroup({
      source,
      events: {
        'Add': props<ActionAdd<Request>>(),
        'Add Success': props<ActionAddSuccess<Response>>(),
        'Add Failure': props<ActionFailure>(),
        'Add Reset': emptyProps()
      }
    });
  }

  static createUpdateGroup<Request, Response>(source: Source) {
    return createActionGroup({
      source,
      events: {
        'Update': props<ActionUpdate<Request>>(),
        'Update Success': props<ActionUpdateSuccess<Response>>(),
        'Update Failure': props<ActionFailure>(),
        'Update Reset': emptyProps()
      }
    });
  }

  static createDeleteGroup(source: Source) {
    return createActionGroup({
      source,
      events: {
        'Delete': props<ActionDelete>(),
        'Delete Success': props<ActionDeleteSuccess>(),
        'Delete Failure': props<ActionFailure>(),
        'Delete Reset': emptyProps()
      }
    });
  }
}



