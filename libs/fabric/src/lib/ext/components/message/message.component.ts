import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { MessageService } from '../../services';

@Component({
  selector: 'fab-message',
  imports: [KeyValuePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './message.component.html',
})
export class MessageComponent {
  readonly #messageService = inject(MessageService);

  readonly messages = this.#messageService.messages;

  @HostBinding('class') styleClass = 'fab messages';
}
