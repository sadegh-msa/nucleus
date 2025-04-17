import { animate, style, transition, trigger } from '@angular/animations';

const TIMINGS = '300ms 0ms ease-in-out';
const DELAY_TIMINGS = '600ms 100ms ease-in-out';

export function getFadeAnimation(timings = TIMINGS, name = 'fadeEnter') {
  return trigger(name, [
    transition(':enter', [style({ opacity: 0 }), animate(timings, style({ opacity: 1 }))]),
    transition(':leave', [animate(timings, style({ opacity: 0 }))]),
  ]);
}

export function getFadeDelayEnterAnimation(timings = DELAY_TIMINGS, name = 'fadeDelayEnter') {
  return trigger(name, [
    transition(':enter', [style({ opacity: 0 }), animate(timings, style({ opacity: 1 }))]),
    transition(':leave', [animate('0ms', style({ opacity: 0 }))]),
  ]);
}
