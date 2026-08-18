import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { IsEmpty } from './is-empty-pipe';

@Component({
  template: `{{ value() | isEmpty }}`,
  imports: [IsEmpty],
})
class HostComponent {
  value = signal<string>('');
}

describe('IsEmpty', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());

  it('should return true for empty string', () => {
    fixture.componentInstance.value.set('');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('true');
  });

  it('should return false for non-empty string', () => {
    fixture.componentInstance.value.set('hello');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBe('false');
  });
});
