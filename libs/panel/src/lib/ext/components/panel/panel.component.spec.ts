import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuPanelComponent } from './panel.component';

describe('PanelComponent', () => {
  let component: NuPanelComponent;
  let fixture: ComponentFixture<NuPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NuPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
