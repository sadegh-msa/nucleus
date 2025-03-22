import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFormToolbarComponent } from './generic-form-toolbar.component';

describe('ListToolbarComponent', () => {
  let component: GenericFormToolbarComponent;
  let fixture: ComponentFixture<GenericFormToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericFormToolbarComponent]
    });
    fixture = TestBed.createComponent(GenericFormToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
