import {
  type AfterViewInit,
  Component,
  computed,
  DOCUMENT,
  ElementRef,
  effect,
  Injector,
  inject,
  input,
  type OnInit,
  signal,
  untracked,
} from '@angular/core';
import type { FieldState } from '@angular/forms/signals';
import { uiDefaultConfig } from '../../../int/configs';
import { uiStyleClass } from '../../../int/constants';
import { UiTooltip } from '../../directives';
import type { UiPlacementType } from '../../types';

const fieldConfig = uiDefaultConfig.formField;
const fieldStyleClass = uiStyleClass.formField;

@Component({
  selector: 'fieldset[uiFormField], ui-form-field',
  templateUrl: './form-field.html',
  imports: [UiTooltip],
  host: {
    '[class]': 'styleClass()',
  },
})
export class UiFormField implements OnInit, AfterViewInit {
  readonly #injector = inject(Injector);
  readonly #elementRef = inject(ElementRef);
  readonly #document = inject(DOCUMENT);

  label = input<string>();
  help = input<string>();
  helpPlacement = input<UiPlacementType>(fieldConfig.helpPlacement);
  hint = input<{ message: string; styleClass?: string }>();
  fieldState = input.required<FieldState<any, any>>();

  readonly formId = signal<string | null>(null);

  readonly name = computed(() => this.fieldState()?.name?.());
  readonly inputId = computed(() => {
    const formId = this.formId();
    const name = this.name();
    return formId && name ? `${formId}-${name.replaceAll('.', '-')}` : '';
  });
  readonly isDirty = computed(() => this.fieldState()?.dirty?.());
  readonly isTouched = computed(() => this.fieldState()?.touched?.());
  readonly isRequired = computed(() => this.fieldState()?.required?.());
  readonly error = computed(() => this.fieldState()?.errors?.()[0]?.message);
  readonly hasError = computed(() => !!((this.isDirty() || this.isTouched()) && this.error()));
  readonly styleClass = computed(() => fieldStyleClass.basic + (this.hasError() ? ' error' : ''));

  readonly #element = this.#elementRef.nativeElement as HTMLElement;

  ngOnInit() {
    this.#fetchFormId();
  }

  ngAfterViewInit() {
    effect(
      () => {
        const inputId = this.inputId();
        const inputName = this.name();

        if (inputId && inputName) {
          untracked(() => (this.#document.getElementsByName(inputName)[0].id = inputId));
        }
      },
      { injector: this.#injector },
    );
  }

  #fetchFormId() {
    let parentElement = this.#element.parentElement;

    while (parentElement && parentElement.tagName?.toUpperCase() !== 'FORM') {
      parentElement = parentElement.parentNode as HTMLElement;
    }

    this.formId.set(parentElement?.id ?? null);
  }
}
