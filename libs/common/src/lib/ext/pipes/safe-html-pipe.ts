import { inject, Pipe, type PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHTML' })
export class SafeHtml implements PipeTransform {
  readonly #domSanitizer = inject(DomSanitizer);

  transform(html: string) {
    return this.#domSanitizer.bypassSecurityTrustHtml(html);
  }
}
