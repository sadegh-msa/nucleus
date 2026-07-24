import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiTemplate } from './template';

@Component({
  template: `<ng-template uiTemplate="testName">Hello</ng-template>`,
  imports: [UiTemplate],
})
class TestHostComponent {
  @ViewChild(UiTemplate) uiTemplate!: UiTemplate;
}

describe('UiTemplate', () => {
  it('should work with ng-template', async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have name getter', async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.uiTemplate.name).toBe('testName');
  });

  it('should have ref getter', async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.uiTemplate.ref).toBeTruthy();
  });
});
