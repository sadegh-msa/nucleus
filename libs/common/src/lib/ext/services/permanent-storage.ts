import { Service } from '@angular/core';
import { AbstractStorage } from '../../int/abstracts/abstract-storage';

@Service()
export class PermanentStorage extends AbstractStorage {
  constructor() {
    super(localStorage);
  }
}
