import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
  signal
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { StyleClassDirective } from '@nucleus/fabric';
import { SvgIconComponent } from 'angular-svg-icon';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { filter } from 'rxjs';
import { AuthPermissionDirective } from '../../../auth';
import { DataType } from '../../../common';
import { infoFieldsDefault } from '../../defaults/info-fields.default';
import { ToolElement } from '../../enums/toolbar.enum';
import { ScrTable } from '../../models/table.model';
import { ScrTool } from '../../models/toolbar.model';
import { FieldValueComponent } from '../field-value/field-value.component';
import { InfoFieldsComponent } from '../info-fields/info-fields.component';

@Component({

  selector: 'scr-generic-list',
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
    SvgIconComponent,
    StyleClassDirective
  ],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericListComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #confirmationService = inject(ConfirmationService);

  readonly ToolElement = ToolElement;
  readonly DataType = DataType;
  readonly altData = computed(() => [...Array(10).keys()]);
  readonly activated = signal<any>(null);

  @Input() infoFields = infoFieldsDefault;
  @Input() idField = 'id';
  @Input() selectionMode?: 'single' | 'multiple' | null;
  @Input() isActivatable = false;
  @Input() table: ScrTable = { columns: [], tools: [] };
  showLoading = input(false);
  firstRow = input(0);
  activatedRow = input<any>();
  data = input.required<any[]>();

  @Output() selection = new EventEmitter<any[]>();
  @Output() activation = new EventEmitter<any>();

  constructor() {
    toObservable(this.activated)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(row => this.activation.emit(row));

    toObservable(this.activatedRow)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter(row => {
          const activated = this.activated();

          if (!row || !activated) {
            return false;
          }

          return row[this.idField] !== activated[this.idField];
        })
      )
      .subscribe(row => this.activated.set(row));
  }

  runCommand(event: MouseEvent, tool: ScrTool, row: any) {
    if (!tool.confirm) {
      tool.command(row);
      return;
    }

    this.#confirmationService.confirm({
      key: tool.key + row[this.idField],
      target: event.target as EventTarget,
      message: tool.confirm,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'fab-button-text fab-button-danger',
      rejectButtonStyleClass: 'fab-button-text fab-button-basic',
      accept: () => tool.command(row)
    });
  }

  changeSelection(selectedRows: any[]) {
    this.selection.emit(selectedRows);
  }

  activateRow(row: any) {
    if (!this.isActivatable) {
      return;
    }

    const activated = (this.activated() || {})[this.idField] !== (row || {})[this.idField]
      ? row
      : null;

    this.activated.set(activated);
  }
}
