import { animate, style, transition, trigger } from '@angular/animations';

const timings = '1ms {{ delay }}ms cubic-bezier(0.4, 0, 0.2, 1)';
const params = { delay: 300 };

export const delayEnterAnimation = trigger('delayEnter', [
  transition(
    ':enter',
    [
      style({ visibility: 'hidden' }), //
      animate(timings, style({ visibility: 'visible' })),
    ],
    { params },
  ),
]);

export const delayLeaveAnimation = trigger('delayLeave', [
  transition(
    ':leave',
    [
      style({ visibility: 'visible' }), //
      animate(timings, style({ visibility: 'hidden' })),
    ],
    { params },
  ),
]);
