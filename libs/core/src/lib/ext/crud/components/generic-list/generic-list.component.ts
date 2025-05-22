import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Output,
  signal
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { DataType } from '@nucleus/common';
import { SvgIconDirective } from '@nucleus/fabric';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { filter } from 'rxjs';
import { AuthPermissionDirective } from '../../../auth';
import { infoFieldsDefault } from '../../defaults/info-fields.default';
import { ToolElement } from '../../enums/toolbar.enum';
import type { InfoField } from '../../models/info.model';
import type { NuTable } from '../../models/table.model';
import type { NuTool } from '../../models/toolbar.model';
import { FieldValueComponent } from '../field-value/field-value.component';
import { InfoFieldsComponent } from '../info-fields/info-fields.component';

@Component({
  selector: 'nu-generic-list',
  templateUrl: './generic-list.component.html',
  imports: [
    AuthPermissionDirective,
    ConfirmPopupModule,
    FieldValueComponent,
    InfoFieldsComponent,
    NgClass,
    OverlayPanelModule,
    RouterModule,
    SkeletonModule,
    TableModule,
    TooltipModule,
    SvgIconDirective,
  ],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericListComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #confirmationService = inject(ConfirmationService);

  readonly ToolElement = ToolElement;
  readonly DataType = DataType;
  readonly altData = computed(() => [...Array(10).keys()]);
  readonly activated = signal<any>(null);

  infoFields = input<InfoField[][]>(infoFieldsDefault);
  idField = input<string>('id');
  selectionMode = input<'single' | 'multiple' | null>(null);
  isActivatable = input(false);
  table = input<NuTable>({ columns: [], tools: [] });
  showLoading = input(false);
  firstRow = input(0);
  activatedRow = input<any>();
  data = input.required<any[]>();

  @Output() selection = new EventEmitter<any[]>();
  @Output() activation = new EventEmitter<any>();

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

  runCommand(targetElement: HTMLButtonElement, tool: NuTool, row: any) {
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
      acceptButtonStyleClass: 'fab button danger basic',
      rejectLabel: $localize`No`,
      rejectButtonStyleClass: 'fab button stamp basic',
      accept: () => tool.command(row),
    });
  }

  changeSelection(selectedRows: any[]) {
    this.selection.emit(selectedRows);
  }

  activateRow(row: any) {
    if (!this.isActivatable) {
      return;
    }

    const activated =
      (this.activated() || {})[this.idField()] !== (row || {})[this.idField()] ? row : null;

    this.activated.set(activated);
  }
}
