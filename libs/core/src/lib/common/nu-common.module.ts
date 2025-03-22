import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NuCommonConfig } from './models/common-config.model';
import { NU_COMMON_CONFIG } from './providers/common-config.provider';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: []
})
export class NuCommonModule {
  static forRoot(config: NuCommonConfig): ModuleWithProviders<NuCommonModule> {
    return {
      ngModule: NuCommonModule,
      providers: [
        { provide: NU_COMMON_CONFIG, useValue: config }
      ]
    };
  }
}
