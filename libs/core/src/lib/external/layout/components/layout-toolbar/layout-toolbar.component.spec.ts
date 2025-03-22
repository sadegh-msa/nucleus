import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutToolbarComponent } from './layout-toolbar.component';

describe('ToolbarComponent', () => {
  let component: LayoutToolbarComponent;
  let fixture: ComponentFixture<LayoutToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutToolbarComponent]
    });
    fixture = TestBed.createComponent(LayoutToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
