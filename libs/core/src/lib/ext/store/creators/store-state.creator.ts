import { OperationStatus } from '@nucleus/common';

export function createListStoreState<State>(type: string) {
  return {
    type,
    query: {},
    response: { control: {}, data: [] },
    message: '',
    status: OperationStatus.Pending,
  } as State;
}

export function createGetStoreState<State>(type: string) {
  return {
    type,
    query: '',
    response: { control: {}, data: {} },
    message: '',
    status: OperationStatus.Pending,
  } as State;
}

export function createAddStoreState<State>(type: string) {
  return {
    type,
    request: {},
    response: { control: {}, data: {} },
    message: '',
    status: OperationStatus.Pending,
  } as State;
}

export function createUpdateStoreState<State>(type: string) {
  return {
    type,
    query: '',
    request: {},
    response: { control: {}, data: {} },
    message: '',
    status: OperationStatus.Pending,
  } as State;
}

export function createDeleteStoreState<State>(type: string) {
  return {
    type,
    query: '',
    response: { control: {}, data: '' },
    message: '',
    status: OperationStatus.Pending,
  } as State;
}
