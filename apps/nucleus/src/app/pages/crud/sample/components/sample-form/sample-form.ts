import { NgClass } from '@angular/common';
import { Component, inject, input, type OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericFormBuilder, GenericFormToolbar, PageType } from '@nucleus/core/crud';
import { Calendar, Loading } from '@nucleus/ui';
import { SampleStatus } from '../../enums/sample-status.enum';
import type { SampleTypedFormModel } from '../../models/sample.model';
import type { GenericSampleFormModel, SampleGenericModel } from '../../models/sample-generic.model';
import { sampleConfig } from '../../sample.config';
import { SampleStore } from '../../store/sample.store';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.html',
  imports: [
    ReactiveFormsModule,
    NgClass,
    Loading,
    GenericFormToolbar,
    Calendar,
  ],
  providers: [GenericFormBuilder],
})
export class SampleForm implements OnInit, GenericSampleFormModel {
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

  data!: GenericSampleFormModel['data'];
  title!: GenericSampleFormModel['title'];
  isSubmitted!: GenericSampleFormModel['isSubmitted'];
  isSubmitting!: GenericSampleFormModel['isSubmitting'];
  save!: GenericSampleFormModel['save'];
  formControlHasError!: GenericSampleFormModel['formControlHasError'];
  toolbar!: GenericSampleFormModel['toolbar'];
  navigationState: GenericSampleFormModel['navigationState'];

  constructor() {
    this.#genericFormBuilder.init(this);
  }

  ngOnInit() {
    this.#genericFormBuilder.run();
  }
}
