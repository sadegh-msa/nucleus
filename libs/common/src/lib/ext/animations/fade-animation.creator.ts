import { animate, style, transition, trigger } from '@angular/animations';

export function createFadeAnimation() {
  return trigger('fade', [
    transition(':enter', [style({ opacity: 0 }), animate('400ms', style({ opacity: 1 }))]),
    transition(':leave', [style({ opacity: 1 }), animate('400ms', style({ opacity: 0 }))]),
  ]);
}
