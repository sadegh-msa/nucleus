import { Service } from '@angular/core';
import { GenericStorage } from '../../int/services/generic-storage';

@Service()
export class TemporaryStorage extends GenericStorage {
  constructor() {
    super(sessionStorage);
  }
}
