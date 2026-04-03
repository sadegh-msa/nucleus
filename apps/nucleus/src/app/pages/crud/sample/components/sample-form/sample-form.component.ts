import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, type OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericFormService, GenericFormToolbarComponent, PageType } from '@nucleus/core';
import { CalendarComponent, ShowLoadingComponent } from '@nucleus/fabric';
import { SampleStatus } from '../../enums/sample-status.enum';
import type { SampleTypedForm } from '../../models/sample.model';
import type { GenericSampleForm, SampleGeneric } from '../../models/sample-generic.model';
import { sampleConfig } from '../../sample.config';
import { sampleActions, sampleSelectors } from '../../store';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.component.html',
  imports: [
    ReactiveFormsModule,
    NgClass,
    ShowLoadingComponent,
    GenericFormToolbarComponent,
    CalendarComponent,
  ],
  providers: [GenericFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleFormComponent implements OnInit, GenericSampleForm {
  readonly #genericFormService = inject(GenericFormService<SampleGeneric>);

  pageType = input(PageType.View);
  id = input('');
  isEmbedded = input(false);

  readonly PageType = PageType;
  readonly config = sampleConfig;
  readonly store = {
    actions: sampleActions,
    selectors: sampleSelectors,
  };
  readonly form = new FormGroup<SampleTypedForm>({
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

  data!: GenericSampleForm['data'];
  title!: GenericSampleForm['title'];
  isSubmitted!: GenericSampleForm['isSubmitted'];
  isSubmitting!: GenericSampleForm['isSubmitting'];
  save!: GenericSampleForm['save'];
  formControlHasError!: GenericSampleForm['formControlHasError'];
  toolbar!: GenericSampleForm['toolbar'];
  navigationState: GenericSampleForm['navigationState'];

  constructor() {
    this.#genericFormService.init(this);
  }

  ngOnInit() {
    this.#genericFormService.run();
  }
}
