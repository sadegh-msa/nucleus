import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CssSupportService {
  calcSize() {
    return CSS.supports('max-height: calc-size(max-content, size)');
  }
}
