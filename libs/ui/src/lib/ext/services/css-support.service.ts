import { Service } from '@angular/core';

@Service()
export class CssSupportService {
  calcSize() {
    return CSS.supports('max-height: calc-size(max-content, size)');
  }
}
