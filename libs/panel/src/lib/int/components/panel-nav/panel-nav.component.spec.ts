import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuPanelNavComponent } from './panel-nav.component';

describe('PanelNavComponent', () => {
  let component: NuPanelNavComponent;
  let fixture: ComponentFixture<NuPanelNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuPanelNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NuPanelNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
