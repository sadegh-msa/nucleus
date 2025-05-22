import { OperationStatus } from '@nucleus/common';

export class StoreStateCreator {
  static createList<State>(type: string) {
    return {
      type,
      query: {},
      response: { control: {}, data: [] },
      message: '',
      status: OperationStatus.Pending,
    } as State;
  }

  static createGet<State>(type: string) {
    return {
      type,
      query: '',
      response: { control: {}, data: {} },
      message: '',
      status: OperationStatus.Pending,
    } as State;
  }

  static createAdd<State>(type: string) {
    return {
      type,
      request: {},
      response: { control: {}, data: {} },
      message: '',
      status: OperationStatus.Pending,
    } as State;
  }

  static createUpdate<State>(type: string) {
    return {
      type,
      query: '',
      request: {},
      response: { control: {}, data: {} },
      message: '',
      status: OperationStatus.Pending,
    } as State;
  }

  static createDelete<State>(type: string) {
    return {
      type,
      query: '',
      response: { control: {}, data: '' },
      message: '',
      status: OperationStatus.Pending,
    } as State;
  }
}
