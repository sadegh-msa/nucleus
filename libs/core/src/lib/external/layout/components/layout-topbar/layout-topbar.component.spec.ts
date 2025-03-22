import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutTopbarComponent } from './layout-topbar.component';

describe('TopbarComponent', () => {
  let component: LayoutTopbarComponent;
  let fixture: ComponentFixture<LayoutTopbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutTopbarComponent]
    });
    fixture = TestBed.createComponent(LayoutTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
