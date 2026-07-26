import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { type Mock, vi } from 'vitest';
import { DateUtil } from '../services/date-util';

import { NuDatePipe } from './date-pipe';

type MockedDateUtil = {
  convertToDate: Mock;
  isValidDate: Mock;
  format: Mock;
  formatDistanceToNow: Mock;
};

@Component({
  template: '{{ date | nuDate: format }}',
  imports: [NuDatePipe],
})
class HostComponent {
  date: string | Date | null = null;
  format: string | 'distance' = '';
}

describe('NuDatePipe', () => {
  let fixture: ComponentFixture<HostComponent>;
  let dateService: MockedDateUtil;

  beforeEach(async () => {
    const mock = {
      convertToDate: vi.fn(),
      isValidDate: vi.fn(),
      format: vi.fn(),
      formatDistanceToNow: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: DateUtil, useValue: mock }],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    dateService = TestBed.inject(DateUtil) as any;
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());

  it('should format a valid date', () => {
    const d = new Date('2024-01-15');
    dateService.convertToDate.mockReturnValue(d);
    dateService.isValidDate.mockReturnValue(true);
    dateService.format.mockReturnValue('2024/01/15');
    fixture.componentInstance.date = '2024-01-15';
    fixture.componentInstance.format = 'YYYY/MM/DD';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2024/01/15');
  });

  it('should handle null input', () => {
    fixture.componentInstance.date = null;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent?.trim()).toBe('');
  });
});
