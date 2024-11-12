import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UiScreenService {
  readonly #breakpointObserver = inject(BreakpointObserver);

  readonly handsetBreakpoint = toSignal(this.#breakpointObserver.observe(Breakpoints.Handset));
  readonly isHandset = computed(() => this.handsetBreakpoint()?.matches);

  readonly handsetPortraitBreakpoint = toSignal(this.#breakpointObserver.observe(Breakpoints.HandsetPortrait));
  readonly isHandsetPortrait = computed(() => this.handsetPortraitBreakpoint()?.matches);

  readonly handsetLandscapeBreakpoint = toSignal(this.#breakpointObserver.observe(Breakpoints.HandsetLandscape));
  readonly isHandsetLandscape = computed(() => this.handsetLandscapeBreakpoint()?.matches);

  readonly tabletBreakpoint = toSignal(this.#breakpointObserver.observe(Breakpoints.Tablet));
  readonly isTablet = computed(() => this.tabletBreakpoint()?.matches);

  readonly tabletPortraitBreakpoint = toSignal(this.#breakpointObserver.observe(Breakpoints.TabletPortrait));
  readonly isTabletPortrait = computed(() => this.tabletPortraitBreakpoint()?.matches);

  readonly tabletLandscapeBreakpoint = toSignal(this.#breakpointObserver.observe(Breakpoints.TabletLandscape));
  readonly isTabletLandscape = computed(() => this.tabletLandscapeBreakpoint()?.matches);

  readonly webBreakpoint = toSignal(this.#breakpointObserver.observe(Breakpoints.Web));
  readonly isWeb = computed(() => this.webBreakpoint()?.matches);

  readonly webPortraitBreakpoint = toSignal(this.#breakpointObserver.observe(Breakpoints.WebPortrait));
  readonly isWebPortrait = computed(() => this.webPortraitBreakpoint()?.matches);

  readonly webLandscapeBreakpoint = toSignal(this.#breakpointObserver.observe(Breakpoints.WebLandscape));
  readonly isWebLandscape = computed(() => this.webLandscapeBreakpoint()?.matches);
}
