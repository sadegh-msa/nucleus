import type { FormArray, FormControl, FormGroup } from '@angular/forms';

export type TypedFormModel<T> = {
  [K in keyof T]: FormControl<T[K] | null>;
}

export type TypedFormArrayModel<T> = FormArray<FormGroup<TypedFormModel<T>>>
