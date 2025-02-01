import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  inject,
  Injector,
  Input,
  signal
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { pairwise, startWith } from 'rxjs';
import { componentStyleClass } from '../../configs';
import { FabPosition } from '../../types';

@Component({
  selector: 'fab-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubble.component.html'
})
export class BubbleComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #injector = inject(Injector);
  readonly #elementRef = inject(ElementRef);

  readonly #isVisible = signal(true);
  readonly #isFloated = signal(false);

  @HostBinding('class') styleClass = componentStyleClass.bubble;

  @HostBinding('class.fab-bubble-hidden')
  get hiddenStyleClass() {
    return !this.#isVisible();
  }

  @HostBinding('class.fab-bubble-floated')
  get floatStyleClass() {
    return this.#isFloated();
  }

  @Input() showCloseButton = false;
  position = signal<FabPosition>('top-center');

  get hostElement() {
    return this.#elementRef.nativeElement;
  }

  get isVisible() {
    return this.#isVisible.asReadonly();
  }

  constructor() {
    this.#handleEvents();
  }

  #handleEvents() {
    toObservable(this.position, { injector: this.#injector })
      .pipe(
        startWith(this.position()),
        pairwise(),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(([previousPosition, newPosition]) => {
        this.hostElement.classList.remove(`fab-bubble-${previousPosition}`);
        this.hostElement.classList.add(`fab-bubble-${newPosition}`);
      });
  }

  toggle() {
    this.#isVisible.set(!this.#isVisible());
  }

  show() {
    this.#isVisible.set(true);
  }

  hide() {
    this.#isVisible.set(false);
  }

  float() {
    this.#isFloated.set(true);
  }

  ground() {
    this.#isFloated.set(false);
  }
}
