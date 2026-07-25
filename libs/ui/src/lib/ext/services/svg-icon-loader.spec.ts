import { TestBed } from '@angular/core/testing';
import { OperationStatus, TemporaryStorage } from '@nucleus/common';
import { afterEach, vi } from 'vitest';
import { provideUiConfig } from '../providers';
import { UiSvgIconLoader } from './svg-icon-loader';

vi.mock('@nucleus/common', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@nucleus/common')>();
  return {
    ...actual,
    sleepRandom: vi.fn().mockResolvedValue(undefined),
  };
});

const mockConfig = {
  icon: { dir: 'icons' },
  message: { duration: 5000 },
  verification: { duration: 60, length: 6 },
};

describe('UiSvgIconLoader', () => {
  let service: UiSvgIconLoader;
  let storage: TemporaryStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideUiConfig(mockConfig)],
    });
    service = TestBed.inject(UiSvgIconLoader);
    storage = TestBed.inject(TemporaryStorage);
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadIcon', () => {
    it('should fetch SVG when cache is empty', async () => {
      const svgContent = '<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>';
      const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(svgContent),
      } as Response);

      const result = await service.loadIcon('outline', 'star');

      expect(result).toBe(svgContent);
      expect(spy).toHaveBeenCalledWith('icons/outline/star.svg');
    });

    it('should return cached SVG if it starts with <svg', async () => {
      const cached = '<svg viewBox="0 0 24 24"><circle/></svg>';
      storage.setItem('uiSvgIcon.outline.star', cached);
      const spy = vi.spyOn(globalThis, 'fetch');

      const result = await service.loadIcon('outline', 'star');

      expect(result).toBe(cached);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should return null when fetch fails', async () => {
      const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(''),
      } as Response);

      const result = await service.loadIcon('outline', 'missing');

      expect(result).toBeNull();
    });

    it('should return null when fetch throws', async () => {
      const spy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

      const result = await service.loadIcon('outline', 'missing');

      expect(result).toBeNull();
    });

    it('should use OperationStatus.Initial when cache exists but is not an SVG', async () => {
      storage.setItem('uiSvgIcon.bold.user', OperationStatus.Initial);
      const svgContent = '<svg viewBox="0 0 24 24"><rect/></svg>';
      const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(svgContent),
      } as Response);

      const result = await service.loadIcon('bold', 'user');

      expect(result).toBe(svgContent);
    });

    it('should store fetched SVG in sessionStorage', async () => {
      const svgContent = '<svg viewBox="0 0 24 24"><path/></svg>';
      const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(svgContent),
      } as Response);

      await service.loadIcon('outline', 'heart');

      expect(storage.getItem('uiSvgIcon.outline.heart')).toBe(svgContent);
    });
  });

  describe('normalizeSvg', () => {
    it('should return sanitized SVG string', () => {
      const rawSvg = '<svg viewBox="0 0 24 24"><path/></svg>';

      const result = service.normalizeSvg(rawSvg, false);

      expect(typeof result).toBe('string');
      expect(result).toContain('svg');
    });

    it('should replace <id-N> placeholders when generateId is true', () => {
      const rawSvg = '<svg viewBox="0 0 24 24"><path id="<id-0>"/></svg>';

      const result = service.normalizeSvg(rawSvg, true);

      expect(result).not.toContain('<id-0>');
      expect(result).toMatch(/<svg[^>]*>/);
    });

    it('should not replace <id-N> placeholders when generateId is false', () => {
      const rawSvg = '<svg viewBox="0 0 24 24"><path id="<id-0>"/></svg>';

      const result = service.normalizeSvg(rawSvg, false);

      expect(result).toContain('<id-0>');
    });
  });
});
