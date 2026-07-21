import '@angular/localize/init';
import '@angular/compiler';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed();

if (typeof CSS === 'undefined') {
  (globalThis as any).CSS = {
    supports: vi.fn().mockReturnValue(false),
  };
}
