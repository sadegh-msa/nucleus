import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type TypedForm<T> = {
  [K in keyof T]: FormControl<T[K] | null>;
}

export type TypedFormArray<T> = FormArray<FormGroup<TypedForm<T>>>

export interface DetailFormRecord<T> {
  index: number,
  formGroup: FormGroup<TypedForm<T>>
}
