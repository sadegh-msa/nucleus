import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { IsNotNil } from './is-not-nil-pipe';

@Component({
  template: `{{ value() | isNotNil }}`,
  imports: [IsNotNil],
})
class HostComponent {
  value = signal<string | null | undefined>(null);
}

describe('IsNotNil', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());

  it('should return false for null', () => {
    fixture.componentInstance.value.set(null);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('false');
  });

  it('should return false for undefined', () => {
    fixture.componentInstance.value.set(undefined);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('false');
  });

  it('should return true for empty string', () => {
    fixture.componentInstance.value.set('');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('true');
  });

  it('should return true for non-empty string', () => {
    fixture.componentInstance.value.set('hello');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('true');
  });
});
