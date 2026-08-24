import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideUiConfig } from '../../providers';
import { UiSvgIconLoader } from '../../services/svg-icon-loader';
import { UiSvgIcon } from './svg-icon';

if (typeof globalThis.IntersectionObserver === 'undefined') {
  (globalThis as any).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

@Component({
  template: '<svg uiSvgIcon="test-icon"></svg>',
  imports: [UiSvgIcon],
})
class TestHostComponent {}

@Component({
  template: '<svg uiSvgIcon="test-icon" variant="bold"></svg>',
  imports: [UiSvgIcon],
})
class VariantHostComponent {}

@Component({
  template: '<svg uiSvgIcon="test-icon" [generateId]="true"></svg>',
  imports: [UiSvgIcon],
})
class GenerateIdHostComponent {}

const mockConfig = {
  icon: { dir: 'icons' },
  message: { duration: 5000 },
  verification: { duration: 60, length: 6 },
};

const mockSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>';

describe('UiSvgIcon', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let svgEl: SVGElement;
  let svgIconLoader: UiSvgIconLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideUiConfig(mockConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    svgEl = fixture.nativeElement.querySelector('svg');
    svgIconLoader = TestBed.inject(UiSvgIconLoader);
  });

  it('should create', () => {
    expect(svgEl).toBeTruthy();
  });

  it('should have ui icon class', () => {
    expect(svgEl.classList.contains('ui')).toBe(true);
    expect(svgEl.classList.contains('icon')).toBe(true);
  });

  it('should have default outline variant', () => {
    expect(svgEl.classList.contains('outline')).toBe(true);
  });

  it('should not be hidden after init', async () => {
    await new Promise((r) => setTimeout(r, 10));
    fixture.detectChanges();
    expect(svgEl.style.display).not.toBe('none');
  });

  it('should destroy without error', () => {
    fixture.destroy();
    expect(true).toBe(true);
  });
});

describe('UiSvgIcon with variant', () => {
  let fixture: ComponentFixture<VariantHostComponent>;
  let svgEl: SVGElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantHostComponent],
      providers: [provideUiConfig(mockConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantHostComponent);
    fixture.detectChanges();
    svgEl = fixture.nativeElement.querySelector('svg');
  });

  it('should apply custom variant class', () => {
    expect(svgEl.classList.contains('bold')).toBe(true);
  });

  it('should still have ui and icon classes', () => {
    expect(svgEl.classList.contains('ui')).toBe(true);
    expect(svgEl.classList.contains('icon')).toBe(true);
  });
});

describe('UiSvgIcon with generateId', () => {
  let fixture: ComponentFixture<GenerateIdHostComponent>;
  let svgEl: SVGElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateIdHostComponent],
      providers: [provideUiConfig(mockConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateIdHostComponent);
    fixture.detectChanges();
    svgEl = fixture.nativeElement.querySelector('svg');
  });

  it('should create with generateId enabled', () => {
    expect(svgEl).toBeTruthy();
  });
});

describe('UiSvgIcon icon loading', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let svgEl: SVGElement;
  let svgIconLoader: UiSvgIconLoader;
  let loadIconSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    loadIconSpy = vi.fn().mockResolvedValue(mockSvg);
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideUiConfig(mockConfig),
        {
          provide: UiSvgIconLoader,
          useValue: { loadIcon: loadIconSpy, normalizeSvg: vi.fn((svg: string) => svg) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    svgEl = fixture.nativeElement.querySelector('svg');
    svgIconLoader = TestBed.inject(UiSvgIconLoader);
  });

  it('should load icon when in viewport', async () => {
    const observers = (globalThis as any).IntersectionObserver.instances || [];
    if (observers.length > 0) {
      const callback = observers[0].constructor.prototype.callback || observers[0]._callback;
      if (callback) {
        callback([{ isIntersecting: true, target: svgEl }], observers[0]);
      }
    }

    await new Promise((r) => setTimeout(r, 100));
    fixture.detectChanges();

    expect(loadIconSpy).toHaveBeenCalled();
  });

  it('should insert icon SVG into element when loaded', async () => {
    const observers = (globalThis as any).IntersectionObserver.instances || [];
    if (observers.length > 0) {
      const callback = observers[0].constructor.prototype.callback || observers[0]._callback;
      if (callback) {
        callback([{ isIntersecting: true, target: svgEl }], observers[0]);
      }
    }

    await new Promise((r) => setTimeout(r, 100));
    fixture.detectChanges();

    expect(svgEl.innerHTML).toContain('path');
  });

  it('should handle empty SVG gracefully', async () => {
    loadIconSpy.mockResolvedValue('');

    const observers = (globalThis as any).IntersectionObserver.instances || [];
    if (observers.length > 0) {
      const callback = observers[0].constructor.prototype.callback || observers[0]._callback;
      if (callback) {
        callback([{ isIntersecting: true, target: svgEl }], observers[0]);
      }
    }

    await new Promise((r) => setTimeout(r, 100));
    fixture.detectChanges();

    expect(svgEl.innerHTML).toBe('');
  });

  it('should handle SVG with only text content gracefully', async () => {
    loadIconSpy.mockResolvedValue('just text');

    const observers = (globalThis as any).IntersectionObserver.instances || [];
    if (observers.length > 0) {
      const callback = observers[0].constructor.prototype.callback || observers[0]._callback;
      if (callback) {
        callback([{ isIntersecting: true, target: svgEl }], observers[0]);
      }
    }

    await new Promise((r) => setTimeout(r, 100));
    fixture.detectChanges();

    expect(svgEl.innerHTML).toBe('');
  });
});
