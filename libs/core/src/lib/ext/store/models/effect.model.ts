import { GenericEntity, RestListQuery, RestServiceCreator } from '../../crud';
import { StoreActionCreator } from '../creators/store-action.creator';

export interface EffectListParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof StoreActionCreator.createListGroup<RestListQuery, T['list']>>;
  method: ReturnType<typeof RestServiceCreator.createList<T>>;
}

export interface EffectGetParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof StoreActionCreator.createGetGroup<T['full']>>;
  method: ReturnType<typeof RestServiceCreator.createGet<T>>;
}

export interface EffectAddParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof StoreActionCreator.createAddGroup<T['add'], T['full']>>;
  method: ReturnType<typeof RestServiceCreator.createAdd<T>>;
}

export interface EffectUpdateParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof StoreActionCreator.createUpdateGroup<T['update'], T['full']>>;
  method: ReturnType<typeof RestServiceCreator.createUpdate<T>>;
}

export interface EffectDeleteParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof StoreActionCreator.createDeleteGroup>;
  method: ReturnType<typeof RestServiceCreator.createDelete>;
}
