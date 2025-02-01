import { inject, Injectable } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { first } from 'rxjs';
import { FABRIC_CONFIG } from '../providers';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  readonly #iconReg = inject(SvgIconRegistryService);
  readonly #fabricConfig = inject(FABRIC_CONFIG);

  loadIcons() {
    const prefix = this.#fabricConfig.ui.icon.svg.dir;
    const icons = this.#fabricConfig.icons;

    for (const icon of icons) {
      this.#iconReg.loadSvg(`${prefix}/${icon}.svg`, icon)?.pipe(first());
    }
  }
}
