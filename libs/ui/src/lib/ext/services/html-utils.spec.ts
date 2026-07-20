import { TestBed } from '@angular/core/testing';

import { UiHtmlUtils } from './html-utils';

describe('UiHtmlUtils', () => {
  let service: UiHtmlUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiHtmlUtils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getElementRect', () => {
    it('should return element rect with correct properties', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const rect = service.getElementRect(element);

      expect(rect).toHaveProperty('top');
      expect(rect).toHaveProperty('left');
      expect(rect).toHaveProperty('height');
      expect(rect).toHaveProperty('width');

      document.body.removeChild(element);
    });
  });

  describe('areElementsOverlapped', () => {
    it('should return true when elements overlap', () => {
      const first = document.createElement('div');
      const second = document.createElement('div');

      jest.spyOn(first, 'getBoundingClientRect').mockReturnValue({
        top: 10,
        left: 10,
        width: 100,
        height: 100,
        right: 110,
        bottom: 110,
        x: 10,
        y: 10,
        toJSON: () => {},
      });
      jest.spyOn(second, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        left: 0,
        width: 200,
        height: 200,
        right: 200,
        bottom: 200,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      const result = service.areElementsOverlapped(first, second);

      expect(result).toBe(true);
    });

    it('should return false when elements do not overlap', () => {
      const first = document.createElement('div');
      const second = document.createElement('div');

      jest.spyOn(first, 'getBoundingClientRect').mockReturnValue({
        top: 10,
        left: 10,
        width: 50,
        height: 50,
        right: 60,
        bottom: 60,
        x: 10,
        y: 10,
        toJSON: () => {},
      });
      jest.spyOn(second, 'getBoundingClientRect').mockReturnValue({
        top: 200,
        left: 200,
        width: 50,
        height: 50,
        right: 250,
        bottom: 250,
        x: 200,
        y: 200,
        toJSON: () => {},
      });

      const result = service.areElementsOverlapped(first, second);

      expect(result).toBe(false);
    });
  });
});
