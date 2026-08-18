import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { IsNotEmpty } from './is-not-empty-pipe';

@Component({
  template: `{{ value() | isNotEmpty }}`,
  imports: [IsNotEmpty],
})
class HostComponent {
  value = signal<string>('');
}

describe('IsNotEmpty', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());

  it('should return false for empty string', () => {
    fixture.componentInstance.value.set('');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('false');
  });

  it('should return true for non-empty string', () => {
    fixture.componentInstance.value.set('hello');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('true');
  });
});
