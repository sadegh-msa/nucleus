import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  Renderer2,
  resource,
  signal,
  untracked,
} from '@angular/core';
import { uiDefaultConfig } from '../../../int/configs';
import { uiStyleClass } from '../../../int/constants';
import { UiSvgIconLoader } from '../../../int/services';
import type { UiIconVariant } from '../../types';

const svgIconConfig = uiDefaultConfig.svgIcon;
const svgIconStyleClass = uiStyleClass.svgIcon;

@Directive({
  selector: 'svg[uiSvgIcon]',
  host: {
    '[class]': 'styleClass()',
  },
})
export class UiSvgIcon implements OnInit, OnDestroy {
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);
  readonly #uiSvgIconLoader = inject(UiSvgIconLoader);

  readonly #intersectionObserver = new IntersectionObserver(([entries], observer) => {
    if (entries.isIntersecting) {
      observer.unobserve(entries.target);
      observer.disconnect();
      this.#isInViewport.set(true);
    }
  });

  readonly #resource = resource({
    params: () => ({
      variant: this.variant(),
      icon: this.icon(),
      isInViewport: this.#isInViewport(),
    }),
    loader: async ({ params }) => {
      if (!params.isInViewport) {
        return null;
      }

      return this.#uiSvgIconLoader.loadIcon(params.variant, params.icon);
    },
  });

  icon = input.required<string>({ alias: 'uiSvgIcon' });
  inputVariant = input<UiIconVariant | undefined>(undefined, { alias: 'variant' });
  generateId = input(false, { transform: booleanAttribute });

  readonly #isInViewport = signal(false);

  readonly rawSvg = computed(() => this.#resource.value());
  readonly variant = computed(() => this.inputVariant() ?? svgIconConfig.variant);
  readonly styleClass = computed(() => `${svgIconStyleClass.basic} ${this.variant()}`);

  constructor() {
    effect(() => {
      const rawSvg = this.rawSvg();

      untracked(() => {
        if (rawSvg) {
          this.#insertIcon(this.#elementRef.nativeElement, rawSvg);
        }
      });
    });
  }

  ngOnInit() {
    const element = this.#elementRef.nativeElement as SVGElement;
    element.style.display = 'none';

    setTimeout(() => {
      this.#intersectionObserver.observe(this.#elementRef.nativeElement);
      element.style.display = '';
    }, 1);
  }

  ngOnDestroy() {
    this.#intersectionObserver.disconnect();
  }

  #insertIcon(hostElement: HTMLElement, rawSvg: string) {
    const tempElement = this.#renderer.createElement('div');
    tempElement.innerHTML = this.#uiSvgIconLoader.normalizeSvg(rawSvg, this.generateId());
    const svgElement = tempElement.children[0];

    if (!svgElement) {
      return;
    }

    svgElement.getAttributeNames().forEach((attribute: string) => {
      this.#renderer.setAttribute(
        hostElement,
        attribute,
        svgElement.getAttribute(attribute) ?? '',
        '',
      );
    });

    this.#renderer.setProperty(hostElement, 'innerHTML', svgElement.innerHTML);
  }
}
