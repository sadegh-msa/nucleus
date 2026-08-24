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
  date: string | Date | null | undefined = null;
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

  it('should handle undefined input', () => {
    fixture.componentInstance.date = undefined;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent?.trim()).toBe('');
    expect(dateService.convertToDate).not.toHaveBeenCalled();
  });

  it('should handle empty string input', () => {
    fixture.componentInstance.date = '';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent?.trim()).toBe('');
    expect(dateService.convertToDate).not.toHaveBeenCalled();
  });

  it('should return the input as-is when conversion returns null', () => {
    dateService.convertToDate.mockReturnValue(null);
    fixture.componentInstance.date = 'not-a-date';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('not-a-date');
    expect(dateService.format).not.toHaveBeenCalled();
  });

  it('should return the input as-is when the date is invalid', () => {
    dateService.convertToDate.mockReturnValue(new Date());
    dateService.isValidDate.mockReturnValue(false);
    fixture.componentInstance.date = 'bad-date';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('bad-date');
    expect(dateService.format).not.toHaveBeenCalled();
  });

  it('should format with distance mode', () => {
    const d = new Date('2024-01-15');
    dateService.convertToDate.mockReturnValue(d);
    dateService.isValidDate.mockReturnValue(true);
    dateService.formatDistanceToNow.mockReturnValue('2 minutes ago');
    fixture.componentInstance.date = '2024-01-15T10:30:00Z';
    fixture.componentInstance.format = 'distance';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2 minutes ago');
    expect(dateService.formatDistanceToNow).toHaveBeenCalledWith(d);
    expect(dateService.format).not.toHaveBeenCalled();
  });

  it('should accept a Date instance input', () => {
    const d = new Date('2024-01-15');
    dateService.convertToDate.mockReturnValue(d);
    dateService.isValidDate.mockReturnValue(true);
    dateService.format.mockReturnValue('2024-01-15');
    fixture.componentInstance.date = d;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('2024-01-15');
    expect(dateService.convertToDate).toHaveBeenCalledWith(d);
  });
});
