import { CommonModule } from '@angular/common';
import { Component, HostBinding, input, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { componentStyleClass } from '../../configs';
import { PopoverDirective } from '../../directives';
import { FabPosition } from '../../types';
import { BubbleComponent } from '../bubble/bubble.component';


@Component({
  selector: 'fab-form-field',
  standalone: true,
  imports: [CommonModule, BubbleComponent, PopoverDirective],
  templateUrl: './form-field.component.html'
})
export class FormFieldComponent {
  @HostBinding('class') styleClass = componentStyleClass['form-field'];

  @Input() inputId = '';
  @Input() label?: string;
  @Input() help?: string;
  @Input() helpPosition: FabPosition = 'top-end';
  @Input() inputFormControl: AbstractControl<any> | null = null;
  messages = input<Record<string, string>>({});
}
