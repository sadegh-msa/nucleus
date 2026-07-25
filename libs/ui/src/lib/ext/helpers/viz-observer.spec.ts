import { VisualObserver } from './viz-observer';

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observed = new Set<Element>();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
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
        threshold: (this.options?.threshold as number) ?? 1,
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

describe('VisualObserver', () => {
  it('should create', () => {
    const observer = new VisualObserver(() => {});
    expect(observer).toBeTruthy();
  });

  describe('observe', () => {
    it('should observe a target element', () => {
      const callback = vi.fn();
      const observer = new VisualObserver(callback);
      const el = document.createElement('div');
      document.body.appendChild(el);

      observer.observe(el);

      expect(MockResizeObserver.instances.length).toBe(1);
      expect(MockResizeObserver.instances[0].observed.has(el)).toBe(true);

      document.body.removeChild(el);
    });

    it('should also observe root element on first observe', () => {
      const observer = new VisualObserver(() => {});
      const el = document.createElement('div');
      document.body.appendChild(el);

      observer.observe(el);

      const resizeObs = MockResizeObserver.instances[0];
      expect(resizeObs.observed.has(document.documentElement)).toBe(true);

      document.body.removeChild(el);
    });

    it('should not duplicate observe for same element', () => {
      const observer = new VisualObserver(() => {});
      const el = document.createElement('div');
      document.body.appendChild(el);

      observer.observe(el);
      observer.observe(el);

      const resizeObs = MockResizeObserver.instances[0];
      // Root + el, no duplicate
      expect(resizeObs.observed.size).toBe(2);

      document.body.removeChild(el);
    });
  });

  describe('unobserve', () => {
    it('should unobserve a target element', () => {
      const observer = new VisualObserver(() => {});
      const el = document.createElement('div');
      document.body.appendChild(el);

      observer.observe(el);
      observer.unobserve(el);

      const resizeObs = MockResizeObserver.instances[0];
      expect(resizeObs.observed.has(el)).toBe(false);

      document.body.removeChild(el);
    });

    it('should disconnect resize observer when no elements remain', () => {
      const observer = new VisualObserver(() => {});
      const el = document.createElement('div');
      document.body.appendChild(el);

      observer.observe(el);
      observer.unobserve(el);

      const resizeObs = MockResizeObserver.instances[0];
      expect(resizeObs.observed.size).toBe(0);

      document.body.removeChild(el);
    });

    it('should do nothing for unknown element', () => {
      const observer = new VisualObserver(() => {});
      const el = document.createElement('div');

      // Should not throw
      observer.unobserve(el);
      expect(true).toBe(true);
    });
  });

  describe('disconnect', () => {
    it('should disconnect all observers', () => {
      const observer = new VisualObserver(() => {});
      const el = document.createElement('div');
      document.body.appendChild(el);

      observer.observe(el);
      observer.disconnect();

      const resizeObs = MockResizeObserver.instances[0];
      expect(resizeObs.observed.size).toBe(0);

      document.body.removeChild(el);
    });
  });

  describe('resize callback', () => {
    it('should call callback when element resizes', () => {
      const callback = vi.fn();
      const observer = new VisualObserver(callback);
      const el = document.createElement('div');
      el.getBoundingClientRect = () => DOMRect.fromRect({ x: 10, y: 20, width: 100, height: 50 });
      document.body.appendChild(el);

      observer.observe(el);

      const resizeObs = MockResizeObserver.instances[0];
      resizeObs.trigger([
        { target: el, contentRect: DOMRect.fromRect({ x: 10, y: 20, width: 200, height: 100 }) },
      ]);

      expect(callback).toHaveBeenCalled();
      const [entries] = callback.mock.calls[0];
      expect(entries.length).toBe(1);
      expect(entries[0].target).toBe(el);

      document.body.removeChild(el);
    });

    it('should refresh all elements when root resizes', () => {
      const callback = vi.fn();
      const observer = new VisualObserver(callback);
      const el = document.createElement('div');
      el.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 0, width: 100, height: 50 });
      document.body.appendChild(el);

      observer.observe(el);

      const resizeObs = MockResizeObserver.instances[0];
      resizeObs.trigger([{ target: document.documentElement }]);

      expect(callback).toHaveBeenCalled();

      document.body.removeChild(el);
    });
  });

  describe('intersection callback', () => {
    it('should handle intersection with threshold change', () => {
      const callback = vi.fn();
      const observer = new VisualObserver(callback);
      const el = document.createElement('div');
      el.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 0, width: 100, height: 50 });
      document.body.appendChild(el);

      observer.observe(el);

      // Trigger initial resize to create IntersectionObserver
      const resizeObs = MockResizeObserver.instances[0];
      resizeObs.trigger([{ target: el }]);

      // Now trigger intersection with different ratio
      const intObs = MockIntersectionObserver.instances[0];
      intObs.trigger([{ target: el, intersectionRatio: 0.5 }]);

      expect(callback).toHaveBeenCalled();

      document.body.removeChild(el);
    });

    it('should handle intersection with zero ratio on first update', () => {
      const callback = vi.fn();
      const observer = new VisualObserver(callback);
      const el = document.createElement('div');
      el.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 0, width: 100, height: 50 });
      document.body.appendChild(el);

      observer.observe(el);

      const resizeObs = MockResizeObserver.instances[0];
      resizeObs.trigger([{ target: el }]);

      const intObs = MockIntersectionObserver.instances[0];
      intObs.trigger([{ target: el, intersectionRatio: 0 }]);

      expect(callback).toHaveBeenCalled();

      document.body.removeChild(el);
    });

    it('should ignore intersection for unknown element', () => {
      const callback = vi.fn();
      const observer = new VisualObserver(callback);
      const el = document.createElement('div');
      const unknownEl = document.createElement('span');
      document.body.appendChild(el);

      observer.observe(el);

      const resizeObs = MockResizeObserver.instances[0];
      resizeObs.trigger([{ target: el }]);

      const intObs = MockIntersectionObserver.instances[0];
      intObs.trigger([{ target: unknownEl, intersectionRatio: 0.5 }]);

      // Should still have been called once (from resize), not again from unknown intersection
      expect(callback).toHaveBeenCalledTimes(1);

      document.body.removeChild(el);
    });
  });

  describe('refreshElement with zero size', () => {
    it('should return entry with isAppearing false when element has zero size', () => {
      const callback = vi.fn();
      const observer = new VisualObserver(callback);
      const el = document.createElement('div');
      document.body.appendChild(el);

      observer.observe(el);

      const resizeObs = MockResizeObserver.instances[0];
      resizeObs.trigger([
        { target: el, contentRect: DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 }) },
      ]);

      expect(callback).toHaveBeenCalled();
      const [entries] = callback.mock.calls[0];
      expect(entries[0].isAppearing).toBe(false);

      document.body.removeChild(el);
    });
  });
});
