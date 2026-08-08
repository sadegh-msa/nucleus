import type { TriggerEventMapType } from '../../ext/types/trigger.type';

export const eventMap = Object.freeze({
  popover: {
    opener: {
      click: 'pointerup',
      focus: 'focus',
      hover: 'pointerenter',
    } as TriggerEventMapType,
    closure: {
      click: 'pointerdown',
      focus: 'focusout',
      hover: 'pointermove',
    } as TriggerEventMapType,
  },
});
