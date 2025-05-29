import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  HostBinding,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  Renderer2,
  resource,
  signal,
  untracked,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OperationStatus, sleep, TemporaryStorageService } from '@nucleus/common';
import { FABRIC_CONFIG } from '../../providers';
import type { IconVariant } from '../../types';

@Directive({
  selector: 'svg[fabSvgIcon]',
})
export class SvgIconDirective implements OnInit, OnDestroy {
  readonly #domSanitizer = inject(DomSanitizer);
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef);
  readonly #fabricConfig = inject(FABRIC_CONFIG);
  readonly #temporaryStorageService = inject(TemporaryStorageService);

  #DEFAULT_VARIANT: IconVariant = 'outline';
  #STORAGE_KEY = 'fabSvgIcon';

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

      const storageKey = `${this.#STORAGE_KEY}.${params.variant}.${params.icon}`;
      let cachedSvg = this.#temporaryStorageService.getItem(storageKey)?.trim();

      while (cachedSvg === OperationStatus.Pending) {
        cachedSvg = this.#temporaryStorageService.getItem(storageKey)?.trim();
        await sleep(10);
      }

      if (cachedSvg?.startsWith('<svg')) {
        return cachedSvg;
      }

      this.#temporaryStorageService.setItem(storageKey, OperationStatus.Pending);
      const url = this.#createIconUrl(params.variant, params.icon);
      const response = await fetch(url);

      if (response.ok) {
        const rawSvg = await response.text();
        this.#temporaryStorageService.setItem(storageKey, rawSvg);

        return rawSvg;
      }

      return null;
    },
  });

  icon = input.required<string>({alias: 'fabSvgIcon'});
  inputVariant = input<IconVariant | undefined>(undefined, {alias: 'variant'});
  generateId = input(false, { transform: booleanAttribute });

  readonly #isInViewport = signal(false);

  readonly rawSvg = computed(() => this.#resource.value());
  readonly variant = computed(() => this.inputVariant() || this.#DEFAULT_VARIANT);

  @HostBinding('class')
  get styleClass() {
    return `fab icon ${this.variant()}`;
  }

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

  #createIconUrl(variant: IconVariant, icon: string) {
    const iconDir = this.#fabricConfig.icon.dir;
    return `${iconDir}/${variant}/${icon}.svg`;
  }

  #updateTagIds(rawSvg: string) {
    let svg = rawSvg;

    const svgIdSet = new Set<string>(svg.match(/<id-\d+>/g) || []);
    const svgSetIter = svgIdSet.values();
    let svgId = svgSetIter.next();

    while (!svgId.done) {
      svg = svg.replaceAll(svgId.value, crypto.randomUUID());
      svgId = svgSetIter.next();
    }

    return svg;
  }

  #normalizeSvg(rawSvg: string) {
    let svg = rawSvg;

    if (this.generateId()) {
      svg = this.#updateTagIds(svg);
    }

    return this.#domSanitizer.bypassSecurityTrustHtml(svg).toString();
  }

  #insertIcon(hostElement: HTMLElement, rawSvg: string) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = this.#normalizeSvg(rawSvg);
    const svgElement = tempElement.children[0];

    if (!svgElement) {
      return;
    }

    const svgAttributes = svgElement.getAttributeNames();
    const svgAttributesLength = svgAttributes.length;

    for (let i = 0; i < svgAttributesLength; i++) {
      const attribute = svgAttributes[i];
      this.#renderer.setAttribute(
        hostElement,
        attribute,
        svgElement.getAttribute(attribute) || '',
        '',
      );
    }

    this.#renderer.setProperty(hostElement, 'innerHTML', svgElement.innerHTML);
  }
}
