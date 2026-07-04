import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelToolbarComponent } from './panel-toolbar.component';

describe('PanelToolbarComponent', () => {
  let component: PanelToolbarComponent;
  let fixture: ComponentFixture<PanelToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
