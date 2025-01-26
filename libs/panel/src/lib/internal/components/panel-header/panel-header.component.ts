import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header[panel-header]',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel-header.component.html',
  styleUrl: './panel-header.component.scss',
})
export class PanelHeaderComponent {}
