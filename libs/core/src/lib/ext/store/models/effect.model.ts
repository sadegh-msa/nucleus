import type {
  createAddRestMethod,
  createDeleteRestMethod,
  createGetRestMethod,
  createListRestMethod,
  createUpdateRestMethod,
  GenericEntity,
  RestListQuery,
} from '../../crud';
import type {
  createAddStoreActionGroup,
  createDeleteStoreActionGroup,
  createGetStoreActionGroup,
  createListStoreActionGroup,
  createUpdateStoreActionGroup,
} from '../creators/store-action.creator';

export interface EffectListParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof createListStoreActionGroup<RestListQuery, T['list']>>;
  method: ReturnType<typeof createListRestMethod<T>>;
}

export interface EffectGetParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof createGetStoreActionGroup<T['full']>>;
  method: ReturnType<typeof createGetRestMethod<T>>;
}

export interface EffectAddParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof createAddStoreActionGroup<T['add'], T['full']>>;
  method: ReturnType<typeof createAddRestMethod<T>>;
}

export interface EffectUpdateParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof createUpdateStoreActionGroup<T['update'], T['full']>>;
  method: ReturnType<typeof createUpdateRestMethod<T>>;
}

export interface EffectDeleteParams<T extends GenericEntity> {
  config: T['config'];
  actions: ReturnType<typeof createDeleteStoreActionGroup>;
  method: ReturnType<typeof createDeleteRestMethod>;
}
