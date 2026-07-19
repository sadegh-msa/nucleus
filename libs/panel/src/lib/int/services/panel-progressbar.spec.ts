import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { PanelProgressbar } from './panel-progressbar';

describe('PanelProgressbar', () => {
  let service: PanelProgressbar;
  let routerEvents$: Subject<any>;
  let router: { navigate: jest.Mock; events: Subject<any> };

  beforeEach(() => {
    routerEvents$ = new Subject();
    router = {
      navigate: jest.fn(),
      events: routerEvents$,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: router }],
    });
    service = TestBed.inject(PanelProgressbar);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('configuration', () => {
    it('should have default configuration values', () => {
      expect(service.intervalValue).toBe(200);
      expect(service.startValue).toBe(0);
      expect(service.endValue).toBe(100);
      expect(service.progressStep).toBe(10);
      expect(service.endDelay).toBe(1500);
    });
  });

  describe('value', () => {
    it('should start at 0', () => {
      expect(service.value()).toBe(0);
    });
  });

  describe('startProgress', () => {
    it('should start progress from 0', () => {
      service.startProgress();

      expect(service.value()).toBe(0);
    });

    it('should increment value over time', () => {
      service.startProgress();

      jest.advanceTimersByTime(200);

      expect(service.value()).toBeGreaterThan(0);
    });
  });

  describe('endProgress', () => {
    it('should set value to endValue', () => {
      service.startProgress();
      service.endProgress();

      expect(service.value()).toBe(100);
    });

    it('should reset to -1 after delay', () => {
      service.startProgress();
      service.endProgress();

      jest.advanceTimersByTime(1500);

      expect(service.value()).toBe(-1);
    });
  });

  describe('navigation events', () => {
    it('should start progress on NavigationStart', () => {
      routerEvents$.next(new NavigationStart(1, '/'));

      expect(service.value()).toBe(0);
    });

    it('should end progress on NavigationEnd', () => {
      service.startProgress();
      routerEvents$.next(new NavigationEnd(1, '/', '/'));

      expect(service.value()).toBe(100);
    });
  });
});
