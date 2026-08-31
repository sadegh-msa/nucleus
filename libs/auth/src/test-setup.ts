import '@angular/localize/init';
import '@angular/compiler';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

setupTestBed();

// Flush Angular signals/effects for zoneless mode - call after each operation
(globalThis as any).flush = async () => {
  const appRef = TestBed.inject(ApplicationRef);
  appRef.tick();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
};
