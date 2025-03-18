import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFieldsComponent } from './info-fields.component';

describe('InfoFieldsComponent', () => {
  let component: InfoFieldsComponent;
  let fixture: ComponentFixture<InfoFieldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoFieldsComponent]
    });
    fixture = TestBed.createComponent(InfoFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
