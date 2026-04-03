import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLayoutComponent } from './sign-layout.component';

describe('SignInComponent', () => {
  let component: SignLayoutComponent;
  let fixture: ComponentFixture<SignLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignLayoutComponent],
    });
    fixture = TestBed.createComponent(SignLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
