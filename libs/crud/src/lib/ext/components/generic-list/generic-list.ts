import { NgClass } from '@angular/common';
import { Component, computed, effect, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiLoading, UiPopover, UiSvgIcon, UiTooltip } from '@nucleus/ui';
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
    UiSvgIcon,
    UiTooltip,
    UiPopover,
    FormsModule,
    UiLoading,
  ],
  providers: [],
})
export class GenericList {
  readonly activatedRow = signal<any>(null);
  readonly selectedRows = signal<Set<any>>(new Set());
  readonly altData = computed(() => [...Array(10).keys()]);

  infoFields = input<InfoFieldModel[][]>(infoFieldsDefault);
  idField = input<string>('id');
  table = input<TableModel>({ columns: [], tools: [] });
  showLoading = input(false);
  firstRow = input(0);
  data = input.required<any[]>();
  isActivatable = input(false);
  activatedRowId = input<string | null>(null, { alias: 'activated' });
  selectionMode = input<'single' | 'multiple' | null>(null);
  selectedRowIds = input<string[]>([], { alias: 'selected' });

  activation = output<any>();
  selection = output<Set<any>>();

  constructor() {
    effect(() => {
      this.data();
      this.idField();

      untracked(() => {
        this.selectedRows.set(new Set());
        this.activatedRow.set(null);
      });
    });

    effect(() => {
      const activated = this.activatedRow();
      untracked(() => this.activation.emit(activated));
    });

    effect(() => {
      const activatedRowId = this.activatedRowId();
      const data = this.data();
      const idField = this.idField();

      untracked(() => {
        const row = data.find((r) => r[idField] === activatedRowId);
        this.activatedRow.set(row);
      });
    });

    effect(() => {
      const selectedRows = this.selectedRows();
      untracked(() => this.selection.emit(selectedRows));
    });

    effect(() => {
      const selectedRowIds = this.selectedRowIds();
      const data = this.data();
      const idField = this.idField();

      untracked(() => {
        const rows = data.filter((r) => selectedRowIds?.includes(r[idField]));
        this.selectedRows.set(new Set(rows));
      });
    });
  }

  onToggleActivation(row: any) {
    if (!this.isActivatable()) {
      return;
    }

    const rowId = (row ?? {})[this.idField()];
    const activatedRowId = (this.activatedRow() ?? {})[this.idField()];

    this.activatedRow.set(activatedRowId !== rowId ? row : null);
  }

  onToggleSelection(row: any) {
    const selectedRows = this.selectedRows();
    const selectionMode = this.selectionMode();

    if (selectedRows.has(row)) {
      selectedRows.delete(row);
    } else {
      if (selectionMode === 'single') {
        selectedRows.clear();
      }

      selectedRows.add(row);
    }

    this.selectedRows.set(new Set(selectedRows.values()));
  }

  onToggleSelectAll() {
    if (this.selectionMode() !== 'multiple') {
      return;
    }

    const data = this.data();
    const selectedRows = this.selectedRows();
    const newSelectedRows = selectedRows.size !== data.length ? data : [];

    this.selectedRows.set(new Set(newSelectedRows));
  }
}
