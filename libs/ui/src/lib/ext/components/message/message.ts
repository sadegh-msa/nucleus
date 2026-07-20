import { KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessageManager } from '../../services/message-manager';

@Component({
  selector: 'ui-message',
  imports: [KeyValuePipe],
  templateUrl: './message.html',
  host: {
    class: 'ui messages',
  },
})
export class Message {
  readonly #messageManager = inject(MessageManager);

  readonly messages = this.#messageManager.messages;
}
