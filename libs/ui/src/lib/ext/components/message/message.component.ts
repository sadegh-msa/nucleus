import { KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessageService } from '../../services';

@Component({
  selector: 'ui-message',
  imports: [KeyValuePipe],
  templateUrl: './message.component.html',
  host: {
    class: 'ui messages',
  },
})
export class MessageComponent {
  readonly #messageService = inject(MessageService);

  readonly messages = this.#messageService.messages;
}
