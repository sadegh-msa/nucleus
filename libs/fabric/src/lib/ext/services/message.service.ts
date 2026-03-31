import { Injectable, inject, signal } from '@angular/core';
import type { Message } from '../models';
import { FABRIC_CONFIG } from '../providers';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  readonly #fabricConfig = inject(FABRIC_CONFIG);

  readonly #DEFAULT_DURATION = this.#fabricConfig.message.duration || 5000;

  #key = 0;
  #messages = signal<Map<number, Message>>(new Map());
  get messages() {
    return this.#messages;
  }

  #createTitle(message: Message) {
    switch (message.variant) {
      case 'success':
        return $localize`Success`;
      case 'danger':
        return $localize`Error`;
      case 'warning':
        return $localize`Warning`;
      case 'info':
        return $localize`Info`;
      default:
        return message.title || $localize`Notification`;
    }
  }

  add(message: Message) {
    const key = ++this.#key;

    this.#messages.update((messages) => {
      messages.set(key, { ...message, title: message.title || this.#createTitle(message) });
      return new Map(messages.entries());
    });

    setTimeout(() => {
      this.remove(key);
    }, message.duration || this.#DEFAULT_DURATION);

    return key;
  }

  remove(key: number) {
    this.#messages.update((messages) => {
      messages.delete(key);
      return new Map(messages.entries());
    });
  }

  addSuccess(content: string, title?: string) {
    this.add({ variant: 'success', title, content });
  }

  addInfo(content: string, title?: string) {
    this.add({ variant: 'info', title, content });
  }

  addWarning(content: string, title?: string) {
    this.add({ variant: 'warning', title, content });
  }

  addError(content: string, code?: number | string, title?: string) {
    this.add({ variant: 'danger', title, content, code });
  }
}
