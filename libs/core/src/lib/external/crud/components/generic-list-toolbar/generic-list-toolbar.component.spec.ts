import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericListToolbarComponent } from './generic-list-toolbar.component';

describe('ListToolbarComponent', () => {
  let component: GenericListToolbarComponent;
  let fixture: ComponentFixture<GenericListToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericListToolbarComponent]
    });
    fixture = TestBed.createComponent(GenericListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
