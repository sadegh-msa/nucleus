import { Service, signal } from '@angular/core';
import { uiDefaultConfig } from '../../int/configs';
import type { UiMessageModel } from '../models';
import { injectUiConfig } from '../providers';

const messageConfig = uiDefaultConfig.message;

@Service()
export class UiMessageManager {
  readonly #uiConfig = injectUiConfig();

  #key = 0;
  #messages = signal<Map<number, UiMessageModel>>(new Map());
  get messages() {
    return this.#messages;
  }

  readonly duration = this.#uiConfig.message.duration || messageConfig.duration;

  #createTitle(message: UiMessageModel) {
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
        return message.title ?? $localize`Notification`;
    }
  }

  add(message: UiMessageModel) {
    const key = ++this.#key;

    this.#messages.update((messages) => {
      messages.set(key, { ...message, title: message.title ?? this.#createTitle(message) });
      return new Map(messages.entries());
    });

    setTimeout(() => {
      this.remove(key);
    }, message.duration || this.duration);

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
