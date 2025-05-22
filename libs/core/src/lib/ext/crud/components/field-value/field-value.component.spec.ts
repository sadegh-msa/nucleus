import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldValueComponent } from './field-value.component';

describe('FormatFieldValueComponent', () => {
  let component: FieldValueComponent;
  let fixture: ComponentFixture<FieldValueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FieldValueComponent],
    });
    fixture = TestBed.createComponent(FieldValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
