import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideFabricConfig } from '@nucleus/fabric';
import { MOCK_FABRIC_CONFIG, setupGlobalMocks } from '@test-mocks';
import { IconComponent } from './icon.component';

setupGlobalMocks();

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
      providers: [provideRouter([]), provideFabricConfig(MOCK_FABRIC_CONFIG)],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have colors', () => {
    expect(component.colors.length).toBeGreaterThan(0);
  });

  it('should have sizes', () => {
    expect(component.sizes.length).toBeGreaterThan(0);
  });

  it('should have variants', () => {
    expect(component.variants.length).toBeGreaterThan(0);
  });
});
