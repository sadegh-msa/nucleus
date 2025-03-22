import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutNavComponent } from './layout-nav.component';

describe('SidebarComponent', () => {
  let component: LayoutNavComponent;
  let fixture: ComponentFixture<LayoutNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutNavComponent]
    });
    fixture = TestBed.createComponent(LayoutNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
