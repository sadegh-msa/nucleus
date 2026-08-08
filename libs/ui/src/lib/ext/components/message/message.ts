import { KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { uiStyleClass } from '../../../int/constants';
import { UiMessageManager } from '../../services/message-manager';

const messageStyleClass = uiStyleClass.message;

@Component({
  selector: 'ui-message',
  imports: [KeyValuePipe],
  templateUrl: './message.html',
  host: {
    '[class]': 'styleClass',
  },
})
export class UiMessage {
  readonly #uiMessageManager = inject(UiMessageManager);

  readonly styleClass = messageStyleClass.container;
  readonly messages = this.#uiMessageManager.messages;
}
