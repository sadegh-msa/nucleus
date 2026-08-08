export type TriggerEventType = 'click' | 'focus' | 'hover';
export type TriggerEventMapType = Record<TriggerEventType, keyof HTMLElementEventMap>;
