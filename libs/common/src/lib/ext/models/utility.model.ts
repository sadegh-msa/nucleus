export type RequiredKeysModel<T> = {
  [K in keyof T as (undefined extends T[K] ? never : K)]: T[K]
}

export type OptionalKeysModel<T> = {
  [K in keyof T as (undefined extends T[K] ? K : never)]: T[K]
}
