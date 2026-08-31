import { NgClass } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { UiSvgIcon, UiTooltip } from '@nucleus/ui';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { filter } from 'rxjs';
import { infoFieldsDefault } from '../../defaults/info-fields.default';
import { AuthPermission } from '../../directives/auth-permission';
import type { InfoFieldModel } from '../../models/info.model';
import type { TableModel } from '../../models/table.model';
import type { ToolModel } from '../../models/toolbar.model';
import { FieldValue } from '../field-value/field-value';
import { InfoFields } from '../info-fields/info-fields';

@Component({
  selector: 'nu-generic-list',
  templateUrl: './generic-list.html',
  imports: [
    AuthPermission,
    ConfirmPopupModule,
    FieldValue,
    InfoFields,
    NgClass,
    OverlayPanelModule,
    RouterModule,
    SkeletonModule,
    TableModule,
    UiSvgIcon,
    UiTooltip,
  ],
  providers: [ConfirmationService],
})
export class GenericList {
  readonly #destroyRef = inject(DestroyRef);
  readonly #confirmationService = inject(ConfirmationService);

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

  runCommand(targetElement: HTMLButtonElement, tool: ToolModel, row: any) {
    if (!tool.confirm) {
      tool.command(row);
      return;
    }

    this.#confirmationService.confirm({
      key: tool.key + row[this.idField()],
      target: targetElement as EventTarget,
      message: tool.confirm,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: $localize`Yes`,
      acceptButtonStyleClass: 'ui button danger basic',
      rejectLabel: $localize`No`,
      rejectButtonStyleClass: 'ui button stamp basic',
      accept: () => tool.command(row),
    });
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
