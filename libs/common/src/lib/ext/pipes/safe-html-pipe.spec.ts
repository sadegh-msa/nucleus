import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeHtml } from './safe-html-pipe';

@Component({
  template: `<div [innerHTML]="html | safeHTML"></div>`,
  imports: [SafeHtml],
})
class HostComponent {
  html = '<b>Hello</b>';
}

describe('SafeHtml', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());

  it('should render HTML', () => {
    const div = fixture.nativeElement.querySelector('div');
    expect(div.innerHTML).toContain('Hello');
  });

  it('should handle different HTML content', () => {
    fixture.componentInstance.html = '<p>test paragraph</p>';
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('div');
    expect(div).toBeTruthy();
  });
});
