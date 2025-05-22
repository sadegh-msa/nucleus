import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelBreadcrumbComponent } from './panel-breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: PanelBreadcrumbComponent;
  let fixture: ComponentFixture<PanelBreadcrumbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelBreadcrumbComponent],
    });
    fixture = TestBed.createComponent(PanelBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
