import { inject, ModuleWithProviders, NgModule } from '@angular/core';
import { FabricConfig } from './models/fabric-config.model';
import { FABRIC_CONFIG } from './providers/fabric-config.provider';
import { IconService } from './services';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class FabricModule {
  readonly #iconService = inject(IconService);

  static forRoot(config: FabricConfig): ModuleWithProviders<FabricModule> {
    return {
      ngModule: FabricModule,
      providers: [{ provide: FABRIC_CONFIG, useValue: config }],
    };
  }

  constructor() {
    this.#iconService.loadIcons();
  }
}
