import { Component, computed, inject, input, type OnInit, signal } from '@angular/core';
import { FormField, form, readonly, required } from '@angular/forms/signals';
import { GenericFormBuilder, GenericFormToolbar, type PageType } from '@nucleus/core';
import { UiFormField, UiLoading } from '@nucleus/ui';
import { AbstractGenericSampleForm } from '../../abstracts/abstract-generic-sample-form';
import type { SampleFormModel } from '../../models/sample.model';
import type { SampleGenericModel } from '../../models/sample-generic.model';
import { sampleConfig } from '../../sample.config';
import { SampleStore } from '../../store/sample-store';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.html',
  imports: [UiLoading, GenericFormToolbar, UiFormField, FormField],
  providers: [GenericFormBuilder],
})
export class SampleForm extends AbstractGenericSampleForm implements OnInit {
  readonly #genericFormBuilder = inject(GenericFormBuilder<SampleGenericModel>);

  pageType = input<PageType>('view');
  inputId = input('', { alias: 'id' });
  isEmbedded = input(false);

  readonly store = inject(SampleStore);
  readonly isViewPage = computed(() => this.pageType() === 'view');
  readonly config = sampleConfig;
  readonly formId = this.config.html.form.id;
  readonly formModel = signal<SampleFormModel>({
    id: '',
    title: '',
    code: '',
    description: '',
    date: new Date(),
    active: true,
    status: 'draft',
    details: [],
  });
  readonly form = form(this.formModel, (spt) => {
    required(spt.title, { message: $localize`Required` });
    required(spt.code, { message: $localize`Required` });
    required(spt.date, { message: $localize`Required` });
    readonly(spt.title, { when: () => this.isViewPage() });
    readonly(spt.code, { when: () => this.isViewPage() });
    readonly(spt.date, { when: () => this.isViewPage() });
    readonly(spt.description, { when: () => this.isViewPage() });
  });

  constructor() {
    super();

    this.#genericFormBuilder.init(this);
  }

  ngOnInit() {
    this.#genericFormBuilder.run();
  }
}
