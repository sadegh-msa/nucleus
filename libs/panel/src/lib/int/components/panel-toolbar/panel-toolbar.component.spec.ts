import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelToolbarComponent } from './panel-toolbar.component';

describe('ToolbarComponent', () => {
  let component: PanelToolbarComponent;
  let fixture: ComponentFixture<PanelToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelToolbarComponent],
    });
    fixture = TestBed.createComponent(PanelToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
