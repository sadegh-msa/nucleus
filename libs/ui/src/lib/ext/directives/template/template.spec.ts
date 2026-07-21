import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTemplate } from './template';

@Component({
  template: `<ng-template uiTemplate="testName">Hello</ng-template>`,
  imports: [UiTemplate],
})
class TestHostComponent {}

describe('UiTemplate', () => {
  it('should work with ng-template', async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
