import { NgClass } from '@angular/common';
import { Component, inject, input, type OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericFormBuilder, GenericFormToolbar, PageType } from '@nucleus/core';
import { UiCalendar, UiLoading } from '@nucleus/ui';
import { AbstractGenericSampleForm } from '../../abstracts/abstract-generic-sample-form';
import { SampleStatus } from '../../enums/sample-status.enum';
import type { SampleTypedFormModel } from '../../models/sample.model';
import type { SampleGenericModel } from '../../models/sample-generic.model';
import { sampleConfig } from '../../sample.config';
import { SampleStore } from '../../store/sample-store';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.html',
  imports: [ReactiveFormsModule, NgClass, UiLoading, GenericFormToolbar, UiCalendar],
  providers: [GenericFormBuilder],
})
export class SampleForm extends AbstractGenericSampleForm implements OnInit {
  readonly #genericFormBuilder = inject(GenericFormBuilder<SampleGenericModel>);

  pageType = input(PageType.View);
  id = input('');
  isEmbedded = input(false);

  readonly PageType = PageType;
  readonly config = sampleConfig;
  readonly store = inject(SampleStore);
  readonly form = new FormGroup<SampleTypedFormModel>({
    id: new FormControl(null),
    title: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    active: new FormControl(true),
    date: new FormControl(new Date()),
    status: new FormControl(SampleStatus.Draft),
    divisionId: new FormControl(null),
    details: new FormControl([]),
  });

  constructor() {
    super();

    this.#genericFormBuilder.init(this);
  }

  ngOnInit() {
    this.#genericFormBuilder.run();
  }
}
