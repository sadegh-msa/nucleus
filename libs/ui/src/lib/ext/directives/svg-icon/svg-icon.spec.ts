import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideUiConfig } from '../../providers';
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

describe('UiSvgIcon', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let svgEl: SVGElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideUiConfig(mockConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    svgEl = fixture.nativeElement.querySelector('svg');
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
