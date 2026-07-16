import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowLoadingComponent } from './show-loading.component';

describe('ShowLoadingComponent', () => {
  let component: ShowLoadingComponent;
  let fixture: ComponentFixture<ShowLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default showLoading as false', () => {
    expect(component.showLoading()).toBe(false);
  });

  it('should have default showLoadingMode as box', () => {
    expect(component.showLoadingMode()).toBe('box');
  });

  it('should apply nu-loading class when showLoading is true', () => {
    fixture.componentRef.setInput('showLoading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('nu-loading')).toBe(true);
  });

  it('should not apply nu-loading class when showLoading is false', () => {
    expect(fixture.nativeElement.classList.contains('nu-loading')).toBe(false);
  });

  it('should apply fullscreen class when mode is fullscreen', () => {
    fixture.componentRef.setInput('showLoading', true);
    fixture.componentRef.setInput('showLoadingMode', 'fullscreen');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('nu-loading-fullscreen')).toBe(true);
  });
});
