import { KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UiMessageManager } from '../../services/message-manager';

@Component({
  selector: 'ui-message',
  imports: [KeyValuePipe],
  templateUrl: './message.html',
  host: {
    class: 'ui messages',
  },
})
export class UiMessage {
  readonly #uiMessageManager = inject(UiMessageManager);

  readonly messages = this.#uiMessageManager.messages;
}
