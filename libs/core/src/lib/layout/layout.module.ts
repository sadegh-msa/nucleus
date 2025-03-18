import { ModuleWithProviders, NgModule } from '@angular/core';
import { LayoutConfig } from './models/layout-config.model';
import { SCR_LAYOUT_CONFIG } from './providers/layout-config.provider';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class LayoutModule {
  static forRoot(config: LayoutConfig): ModuleWithProviders<LayoutModule> {
    return {
      ngModule: LayoutModule,
      providers: [{ provide: SCR_LAYOUT_CONFIG, useValue: config }],
    };
  }
}
