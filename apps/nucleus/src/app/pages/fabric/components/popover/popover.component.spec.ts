import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideFabricConfig } from '@nucleus/fabric';
import { MOCK_FABRIC_CONFIG, setupGlobalMocks } from '@test-mocks';
import { PopoverComponent } from './popover.component';

setupGlobalMocks();

describe('PopoverComponent', () => {
  let component: PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverComponent],
      providers: [provideRouter([]), provideFabricConfig(MOCK_FABRIC_CONFIG)],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have placements', () => {
    expect(component.placements.length).toBeGreaterThan(0);
  });

  it('should default popoverEvent to click', () => {
    expect(component.popoverEvent()).toBe('click');
  });

  it('should toggle popoverEvent', () => {
    component.togglePopoverEvent();
    expect(component.popoverEvent()).toBe('hover');
    component.togglePopoverEvent();
    expect(component.popoverEvent()).toBe('click');
  });

  it('should toggle popoverHasBubble', () => {
    expect(component.popoverHasBubble()).toBe(true);
    component.togglePopoverHasBubble();
    expect(component.popoverHasBubble()).toBe(false);
  });

  it('should toggle popoverHasClose', () => {
    expect(component.popoverHasClose()).toBe(false);
    component.togglePopoverHasClose();
    expect(component.popoverHasClose()).toBe(true);
  });

  it('should toggle popoverDisabled', () => {
    expect(component.popoverDisabled()).toBe(false);
    component.togglePopoverDisabled();
    expect(component.popoverDisabled()).toBe(true);
  });
});
