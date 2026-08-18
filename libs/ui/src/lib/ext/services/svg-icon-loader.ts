import { inject, Service } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { sleepRandom, TemporaryStorage } from '@nucleus/common';
import { uiDefaultConfig } from '../../int/configs';
import { injectUiConfig } from '../providers';
import type { UiIconVariant } from '../types';

const svgIconConfig = uiDefaultConfig.svgIcon;

@Service()
export class UiSvgIconLoader {
  readonly #domSanitizer = inject(DomSanitizer);
  readonly #uiConfig = injectUiConfig();
  readonly #temporaryStorage = inject(TemporaryStorage);

  async loadIcon(variant: UiIconVariant, icon: string): Promise<string | null> {
    const { loadingStatus, retryingTimes, storageKeyPrefix } = svgIconConfig;
    const storageKey = `${storageKeyPrefix}.${variant}.${icon}`;
    let cachedSvg = this.#temporaryStorage.getItem(storageKey)?.trim();

    let retrying = 0;

    while (cachedSvg === loadingStatus && retrying <= retryingTimes) {
      cachedSvg = this.#temporaryStorage.getItem(storageKey)?.trim();
      await sleepRandom();
      retrying++;
    }

    if (cachedSvg?.startsWith('<svg')) {
      return cachedSvg;
    }

    this.#temporaryStorage.setItem(storageKey, loadingStatus);

    try {
      const url = this.#createIconUrl(variant, icon);
      const response = await fetch(url);

      if (response.ok) {
        const rawSvg = await response.text();
        this.#temporaryStorage.setItem(storageKey, rawSvg);
        return rawSvg;
      }
    } catch {}

    return null;
  }

  normalizeSvg(rawSvg: string, generateId: boolean) {
    let svg = rawSvg;

    if (generateId) {
      svg = this.#updateTagIds(svg);
    }

    return this.#domSanitizer.bypassSecurityTrustHtml(svg).toString();
  }

  #createIconUrl(variant: UiIconVariant, icon: string) {
    const iconDir = this.#uiConfig.icon.dir;
    return `${iconDir}/${variant}/${icon}.svg`;
  }

  #updateTagIds(rawSvg: string) {
    let svg = rawSvg;

    const svgIdSet = new Set<string>(svg.match(/<id-\d+>/g) || []);

    svgIdSet.forEach((svgId) => {
      svg = svg.replaceAll(svgId, crypto.randomUUID());
    });

    return svg;
  }
}
