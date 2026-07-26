import { Service } from '@angular/core';
import { AbstractStorage } from '../../int/abstracts/abstract-storage';

@Service()
export class TemporaryStorage extends AbstractStorage {
  constructor() {
    super(sessionStorage);
  }
}
