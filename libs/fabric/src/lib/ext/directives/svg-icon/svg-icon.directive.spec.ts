import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFabricConfig } from '../../providers';
import { SvgIconDirective } from './svg-icon.directive';

if (typeof globalThis.IntersectionObserver === 'undefined') {
  (globalThis as any).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

@Component({
  template: '<svg fabSvgIcon="test-icon"></svg>',
  imports: [SvgIconDirective],
})
class TestHostComponent {}

describe('SvgIconDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let svgEl: SVGElement;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideFabricConfig(mockConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    svgEl = fixture.nativeElement.querySelector('svg');
  });

  it('should create', () => {
    expect(svgEl).toBeTruthy();
  });

  it('should have fab icon class', () => {
    expect(svgEl.classList.contains('fab')).toBe(true);
    expect(svgEl.classList.contains('icon')).toBe(true);
  });

  it('should have default outline variant', () => {
    expect(svgEl.classList.contains('outline')).toBe(true);
  });
});
