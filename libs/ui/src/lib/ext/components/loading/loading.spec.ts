import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { UiLoading } from './loading';

describe('UiLoading', () => {
  let component: UiLoading;
  let fixture: ComponentFixture<UiLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiLoading],
    }).compileComponents();

    fixture = TestBed.createComponent(UiLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default loading as false', () => {
    expect(component.loading()).toBe(false);
  });

  it('should have default loadingMode as box', () => {
    expect(component.loadingMode()).toBe('box');
  });

  it('should apply nu-loading class when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('nu-loading')).toBe(true);
  });

  it('should not apply nu-loading class when loading is false', () => {
    expect(fixture.nativeElement.classList.contains('nu-loading')).toBe(false);
  });

  it('should apply fullscreen class when mode is fullscreen', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingMode', 'fullscreen');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('nu-loading-fullscreen')).toBe(true);
  });
});
