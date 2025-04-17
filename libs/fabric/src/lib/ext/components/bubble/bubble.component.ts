import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  Injector,
  inject,
  model,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { pairwise, startWith } from 'rxjs';
import type { FabPosition } from '../../types';

@Component({
  selector: 'fab-bubble',
  templateUrl: './bubble.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #injector = inject(Injector);
  readonly #elementRef = inject(ElementRef);

  @HostBinding('class.invisible')
  get invisibleStyleClass() {
    return !this.isVisible();
  }

  @HostBinding('class.floated')
  get floatStyleClass() {
    return this.isFloated();
  }

  isVisible = model(false);
  isFloated = model(false);
  showCloseButton = model(false);
  position = model<FabPosition>('auto');

  get hostElement() {
    return this.#elementRef.nativeElement;
  }

  constructor() {
    this.#handleEvents();
  }

  #handleEvents() {
    toObservable(this.position, { injector: this.#injector })
      .pipe(startWith(this.position()), pairwise(), takeUntilDestroyed(this.#destroyRef))
      .subscribe(([previousPosition, newPosition]) => {
        this.hostElement.classList.remove(previousPosition);
        this.hostElement.classList.add(newPosition);
      });
  }

  toggle() {
    this.isVisible.set(!this.isVisible());
  }

  show() {
    this.isVisible.set(true);
  }

  hide() {
    this.isVisible.set(false);
  }

  float() {
    this.isFloated.set(true);
  }

  ground() {
    this.isFloated.set(false);
  }
}
