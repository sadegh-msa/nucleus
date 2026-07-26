import { Service } from '@angular/core';
import { GenericStorage } from '../../int/services/generic-storage';

@Service()
export class PermanentStorage extends GenericStorage {
  constructor() {
    super(localStorage);
  }
}
