import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthPermission } from './auth-permission';

@Component({
  template: `<div *permission="perm">Content</div>`,
  imports: [AuthPermission],
})
class TestHostComponent {
  perm = 'view';
}

describe('AuthPermission', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create host component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show content with truthy permission', () => {
    expect(fixture.nativeElement.textContent).toContain('Content');
  });

  it('should render with empty permission', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    const f = TestBed.createComponent(TestHostComponent);
    f.componentInstance.perm = '';
    f.detectChanges();
    await f.whenStable();
    expect(f.nativeElement.textContent).not.toContain('Content');
  });
});
