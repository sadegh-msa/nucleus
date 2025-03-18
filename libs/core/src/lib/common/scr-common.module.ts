import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ScrCommonConfig } from './models/common-config.model';
import { SCR_COMMON_CONFIG } from './providers/common-config.provider';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: []
})
export class ScrCommonModule {
  static forRoot(config: ScrCommonConfig): ModuleWithProviders<ScrCommonModule> {
    return {
      ngModule: ScrCommonModule,
      providers: [
        { provide: SCR_COMMON_CONFIG, useValue: config }
      ]
    };
  }
}
