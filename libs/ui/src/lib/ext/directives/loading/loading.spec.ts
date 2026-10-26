import { DOCUMENT } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideUiConfig } from '@nucleus/ui';
import { MOCK_UI_CONFIG, setupGlobalMocks } from '@test-mocks';
import { vi } from 'vitest';
import { UiLoading } from './loading';

setupGlobalMocks();

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  observed = new Set<Element>();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.observed.add(target);
  }

  unobserve(target: Element) {
    this.observed.delete(target);
  }

  disconnect() {
    this.observed.clear();
  }

  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(
      entries.map((e) => ({
        target: e.target ?? document.createElement('div'),
        intersectionRatio: e.intersectionRatio ?? 1,
        boundingClientRect:
          e.boundingClientRect ?? DOMRect.fromRect({ x: 0, y: 0, width: 100, height: 50 }),
        root: null,
        rootMargin: '',
        threshold: 1,
        time: 0,
        isIntersecting: e.intersectionRatio !== 0,
        isVisible: true,
      })) as unknown as IntersectionObserverEntry[],
      this,
    );
  }
}

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  callback: ResizeObserverCallback;
  observed = new Set<Element>();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe(target: Element) {
    this.observed.add(target);
  }

  unobserve(target: Element) {
    this.observed.delete(target);
  }

  disconnect() {
    this.observed.clear();
  }

  trigger(entries: Partial<ResizeObserverEntry>[]) {
    this.callback(
      entries.map((e) => ({
        target: e.target ?? document.createElement('div'),
        contentRect: e.contentRect ?? DOMRect.fromRect({ x: 0, y: 0, width: 100, height: 50 }),
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      })) as ResizeObserverEntry[],
      this,
    );
  }
}

beforeEach(() => {
  MockIntersectionObserver.instances = [];
  MockResizeObserver.instances = [];
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
  (globalThis as any).ResizeObserver = MockResizeObserver;
});

afterEach(() => {
  delete (globalThis as any).IntersectionObserver;
  delete (globalThis as any).ResizeObserver;
});

@Component({
  selector: 'test-host',
  template: `<div uiLoading [uiLoading]="showLoading" [uiLoadingStyleClass]="styleClass" style="position: relative; width: 200px; height: 100px;"></div>`,
  imports: [UiLoading],
})
class TestHostComponent {
  showLoading = false;
  styleClass = 'ui loading';
}

describe('UiLoading', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let directive: UiLoading;
  let testElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideUiConfig(MOCK_UI_CONFIG), { provide: DOCUMENT, useValue: document }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    testElement = fixture.nativeElement.querySelector('div');
    const directiveElements = fixture.debugElement.queryAll((el) =>
      el.injector.get(UiLoading, null),
    );
    directive = directiveElements[0]?.injector.get(UiLoading);
  });

  afterEach(() => {
    const container = document.getElementById('ui-loading-container');
    if (container) {
      container.remove();
    }
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  describe('inputs', () => {
    it('should have showLoading input with default false', () => {
      expect(hostComponent.showLoading).toBe(false);
    });

    it('should have styleClass input with default', () => {
      expect(hostComponent.styleClass).toBe('ui loading');
    });
  });

  describe('container management', () => {
    it('should create container element', () => {
      hostComponent.showLoading = true;
      fixture.detectChanges();

      const container = document.getElementById('ui-loading-container');
      expect(container).toBeTruthy();
    });

    it('should append container to document body', () => {
      hostComponent.showLoading = true;
      fixture.detectChanges();

      const container = document.getElementById('ui-loading-container');
      expect(container?.parentElement).toBe(document.body);
    });

    it('should reuse existing container', () => {
      hostComponent.showLoading = true;
      fixture.detectChanges();

      const firstContainer = document.getElementById('ui-loading-container');

      hostComponent.showLoading = false;
      fixture.detectChanges();
      hostComponent.showLoading = true;
      fixture.detectChanges();

      const secondContainer = document.getElementById('ui-loading-container');
      expect(secondContainer).toBe(firstContainer);
    });
  });

  describe('getTargetElementRect', () => {
    it('should return bounding client rect of target element', () => {
      testElement.getBoundingClientRect = () =>
        DOMRect.fromRect({ x: 15, y: 25, width: 150, height: 75 });

      const rect = directive.getTargetElementRect();

      expect(rect.left).toBe(15);
      expect(rect.top).toBe(25);
      expect(rect.width).toBe(150);
      expect(rect.height).toBe(75);
    });
  });

  describe('updateLoadingElementPosition', () => {
    it('should not throw when loading element is null', () => {
      hostComponent.showLoading = false;
      fixture.detectChanges();

      expect(() => directive.updateLoadingElementPosition()).not.toThrow();
    });
  });

  describe('ngOnDestroy', () => {
    it('should not throw on destroy', () => {
      expect(() => fixture.destroy()).not.toThrow();
    });
  });
});
