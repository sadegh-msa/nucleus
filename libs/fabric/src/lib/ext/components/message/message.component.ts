import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageService } from '../../services';

@Component({
  selector: 'fab-message',
  imports: [KeyValuePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './message.component.html',
  host: {
    class: 'fab messages',
  },
})
export class MessageComponent {
  readonly #messageService = inject(MessageService);

  readonly messages = this.#messageService.messages;
}
