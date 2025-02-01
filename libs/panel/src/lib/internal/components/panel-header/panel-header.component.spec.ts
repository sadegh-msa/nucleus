import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuPanelHeaderComponent } from './panel-header.component';

describe('PanelHeaderComponent', () => {
  let component: NuPanelHeaderComponent;
  let fixture: ComponentFixture<NuPanelHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuPanelHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NuPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
