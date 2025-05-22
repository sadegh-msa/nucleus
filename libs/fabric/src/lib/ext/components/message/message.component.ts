import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { fadeAnimation } from '../../animations';
import { MessageService } from '../../services';

@Component({
  selector: 'fab-message',
  imports: [
    KeyValuePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation],
  templateUrl: './message.component.html',
})
export class MessageComponent {
  readonly #messageService = inject(MessageService);

  readonly messages = this.#messageService.messages;

  @HostBinding('class') styleClass = 'fab messages';
}
