import { NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { UiPopover, UiSvgIcon, UiTooltip } from '@nucleus/ui';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { filter } from 'rxjs';
import { infoFieldsDefault } from '../../../int/constants';
import { AuthPermission } from '../../directives/auth-permission';
import type { InfoFieldModel } from '../../models/info.model';
import type { TableModel } from '../../models/table.model';
import { FieldValue } from '../field-value/field-value';
import { InfoFields } from '../info-fields/info-fields';

@Component({
  selector: 'nu-generic-list',
  templateUrl: './generic-list.html',
  imports: [
    AuthPermission,
    FieldValue,
    InfoFields,
    NgClass,
    RouterModule,
    SkeletonModule,
    TableModule,
    UiSvgIcon,
    UiTooltip,
    UiPopover
  ],
  providers: [],
})
export class GenericList {
  readonly #destroyRef = inject(DestroyRef);

  readonly altData = computed(() => [...Array(10).keys()]);
  readonly activated = signal<any>(null);

  infoFields = input<InfoFieldModel[][]>(infoFieldsDefault);
  idField = input<string>('id');
  selectionMode = input<'single' | 'multiple' | null>(null);
  isActivatable = input(false);
  table = input<TableModel>({ columns: [], tools: [] });
  showLoading = input(false);
  firstRow = input(0);
  activatedRow = input<any>();
  data = input.required<any[]>();

  selection = output<any[]>();
  activation = output<any>();

  constructor() {
    toObservable(this.activated)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((row) => this.activation.emit(row));

    toObservable(this.activatedRow)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter((row) => {
          const activated = this.activated();

          if (!row || !activated) {
            return false;
          }

          return row[this.idField()] !== activated[this.idField()];
        }),
      )
      .subscribe((row) => this.activated.set(row));
  }

  changeSelection(selectedRows: any[]) {
    this.selection.emit(selectedRows);
  }

  activateRow(row: any) {
    if (!this.isActivatable()) {
      return;
    }

    const activated =
      (this.activated() ?? {})[this.idField()] !== (row ?? {})[this.idField()] ? row : null;

    this.activated.set(activated);
  }
}
