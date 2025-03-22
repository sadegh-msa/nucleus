export type RequiredKeys<T> = {
  [K in keyof T as (undefined extends T[K] ? never : K)]: T[K]
}

export type OptionalKeys<T> = {
  [K in keyof T as (undefined extends T[K] ? K : never)]: T[K]
}
