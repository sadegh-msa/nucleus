import { animate, style, transition, trigger } from '@angular/animations';

const timings = '{{ duration }}ms {{ delay }}ms cubic-bezier(0.4, 0, 0.2, 1)';
const params = { duration: 300, delay: 0 };

export const fadeAnimation = trigger('fade', [
  transition(
    ':enter',
    [
      style({ opacity: 0 }), //
      animate(timings, style({ opacity: 1 })),
    ],
    { params },
  ),
  transition(
    ':leave',
    [
      animate(timings, style({ opacity: 0 })), //
    ],
    { params },
  ),
]);
