import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelMainComponent } from './panel-main.component';

describe('PanelComponent', () => {
  let component: PanelMainComponent;
  let fixture: ComponentFixture<PanelMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
