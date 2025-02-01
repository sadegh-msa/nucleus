import { InjectionToken } from '@angular/core';
import { FabricConfig } from '../models';

export const FABRIC_CONFIG = new InjectionToken<FabricConfig>('fabric.config');
