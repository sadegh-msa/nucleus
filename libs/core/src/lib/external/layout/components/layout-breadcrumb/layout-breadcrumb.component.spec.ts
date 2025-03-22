import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutBreadcrumbComponent } from './layout-breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: LayoutBreadcrumbComponent;
  let fixture: ComponentFixture<LayoutBreadcrumbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutBreadcrumbComponent]
    });
    fixture = TestBed.createComponent(LayoutBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
