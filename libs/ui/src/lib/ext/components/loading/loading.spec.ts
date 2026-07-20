import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { Loading } from './loading';

describe('Loading', () => {
  let component: Loading;
  let fixture: ComponentFixture<Loading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loading],
    }).compileComponents();

    fixture = TestBed.createComponent(Loading);
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
