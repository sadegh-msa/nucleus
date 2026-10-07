import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiDialog } from './dialog';

@Component({
  template: `
    <dialog #dialogRef uiDialog [uiDialog]="isVisible()" [uiDialogStyleClass]="styleClass()"></dialog>
    <button (click)="toggle()">Toggle</button>
  `,
  imports: [UiDialog],
})
class TestHostComponent {
  isVisible = signal(false);
  styleClass = signal('custom-class');
  toggle = () => this.isVisible.update((v) => !v);
}

describe('UiDialog', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let dialogElement: HTMLDialogElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    dialogElement = fixture.debugElement.query(By.css('dialog')).nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(By.directive(UiDialog)).injector.get(UiDialog);
    expect(directive).toBeTruthy();
  });

  it('should not show dialog when visible is false', () => {
    expect(dialogElement.open).toBeFalsy();
  });

  it('should show dialog when visible becomes true', () => {
    component.isVisible.set(true);
    fixture.detectChanges();
    expect(dialogElement.open).toBeTruthy();
  });

  it('should hide dialog when visible becomes false', () => {
    component.isVisible.set(true);
    fixture.detectChanges();
    expect(dialogElement.open).toBeTruthy();

    component.isVisible.set(false);
    fixture.detectChanges();
    expect(dialogElement.open).toBeFalsy();
  });

  it('should apply custom style class', () => {
    component.isVisible.set(true);
    fixture.detectChanges();
    expect(dialogElement.classList.contains('custom-class')).toBeTruthy();
  });

  it('should apply default style class when none provided', () => {
    component.styleClass = signal('basic');
    component.isVisible.set(true);
    fixture.detectChanges();
    expect(dialogElement.classList.contains('basic')).toBeTruthy();
  });

  it('should toggle visibility when button clicked', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    button.click();
    fixture.detectChanges();
    expect(dialogElement.open).toBeTruthy();

    button.click();
    fixture.detectChanges();
    expect(dialogElement.open).toBeFalsy();
  });
});