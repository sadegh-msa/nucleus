import { computed, Injectable, signal } from '@angular/core';

const sizes = ['sm', 'md', 'lg', 'xl', 'xxl', 'tablet', 'web'] as const;
type Size = typeof sizes[number];
type Window = { height: number, width: number, fontSize: number }

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  readonly #breakpointsRem = {
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
    xxl: 96,
    tablet: 40,
    web: 64
  } as Readonly<Record<Size, number>>;

  readonly #window = signal<Window>(this.#getWindow());
  readonly breakpoints = computed(() => {
    const { width, height, fontSize } = this.#window();
    const { sm, md, lg, xl, xxl, tablet, web } = Object.fromEntries(
      Object.entries(this.#breakpointsRem).map(([s, v]) => [s, v * fontSize])
    ) as Record<Size, number>;

    return {
      isXs: width <= sm,
      isSm: width >= sm && width < md,
      isGtSm: width >= sm,
      isMd: width >= md && width < lg,
      isGtMd: width >= md,
      isLg: width >= lg && width < xl,
      isGtLg: width >= lg,
      isXl: width >= xl && width < xxl,
      isGtXl: width >= xl,
      isGtXxl: width >= xxl,
      isHandset: width <= tablet,
      isGtHandset: width >= tablet,
      isTablet: width >= tablet && width < web,
      isWeb: width >= web,
      isPortrait: width < height,
      isLandscape: width > height
    };
  });

  #windowTimer?: number;

  constructor() {
    (new ResizeObserver(() => {
      clearTimeout(this.#windowTimer);
      this.#windowTimer = setTimeout(() => {
        if (!this.#windowTimer) {
          return;
        }

        this.#window.set(this.#getWindow());
      }, 100);
    })).observe(document.body);
  }

  #getWindow() {
    const computedStyle = window.getComputedStyle(document.body, null)
      .getPropertyValue('font-size');

    return {
      height: window.screen.availHeight,
      width: window.screen.availWidth,
      fontSize: Number.parseFloat(computedStyle)
    };
  }
}
