import { computed, DOCUMENT, inject, Service, signal } from '@angular/core';
import type { SetTimeoutType } from '@nucleus/common';
import type { ScreenSizeType } from '../types/screen.type';

@Service()
export class UiScreen {
  readonly #document = inject(DOCUMENT);

  readonly #breakpointsRem = {
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
    xxl: 96,
    tablet: 40,
    web: 64,
  } as Readonly<Record<ScreenSizeType, number>>;

  readonly #windowInfo = signal(this.#getWindowInfo());
  readonly breakpoints = computed(() => {
    const { width, height, fontSize } = this.#windowInfo();
    const { sm, md, lg, xl, xxl, tablet, web } = Object.fromEntries(
      Object.entries(this.#breakpointsRem).map(([s, v]) => [s, v * fontSize]),
    ) as Record<ScreenSizeType, number>;

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
      isLandscape: width > height,
    };
  });

  #windowTimer?: SetTimeoutType;

  constructor() {
    new ResizeObserver(() => {
      clearTimeout(this.#windowTimer);
      this.#windowTimer = setTimeout(() => {
        this.#updateWindowInfo();
      }, 100);
    }).observe(this.#document.body);
  }

  #getWindowInfo() {
    const computedStyle = window.getComputedStyle(this.#document.body, null);
    const fontSize = Number.parseFloat(computedStyle.getPropertyValue('font-size'));

    return {
      fontSize,
      height: window.screen.availHeight,
      width: window.screen.availWidth,
    };
  }

  #updateWindowInfo() {
    this.#windowInfo.set(this.#getWindowInfo());
  }
}
