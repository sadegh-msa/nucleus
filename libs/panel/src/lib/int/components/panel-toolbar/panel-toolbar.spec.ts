import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelToolbar } from './panel-toolbar';

describe('PanelToolbar', () => {
  let component: PanelToolbar;
  let fixture: ComponentFixture<PanelToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
