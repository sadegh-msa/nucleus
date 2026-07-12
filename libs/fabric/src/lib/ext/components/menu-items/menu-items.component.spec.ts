import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideFabricConfig } from '../../providers';
import { MenuItemsComponent } from './menu-items.component';

describe('MenuItemsComponent', () => {
  let component: MenuItemsComponent;
  let fixture: ComponentFixture<MenuItemsComponent>;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  const mockItems = [
    { label: 'Home', routerLink: '/' },
    { label: 'About', routerLink: '/about' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemsComponent],
      providers: [provideRouter([]), provideFabricConfig(mockConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fabMenuItems', mockItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have items computed', () => {
    expect(component.items()).toBeTruthy();
    expect(component.items().length).toBe(2);
  });

  it('should have default extent as wide', () => {
    expect(component.extent()).toBe('wide');
  });

  it('should compute isWide correctly', () => {
    expect(component.isWide()).toBe(true);
    fixture.componentRef.setInput('extent', 'compact');
    expect(component.isWide()).toBe(false);
  });

  it('should compute isCompact correctly', () => {
    expect(component.isCompact()).toBe(false);
    fixture.componentRef.setInput('extent', 'compact');
    expect(component.isCompact()).toBe(true);
  });

  it('should have default mode as still', () => {
    expect(component.mode()).toBe('still');
  });

  it('should collapse item', () => {
    const item = { label: 'Test', expanded: true, children: [{ label: 'Child', expanded: true }] };
    component.collapseItem(item);
    expect(item.expanded).toBe(false);
    expect(item.children?.[0].expanded).toBe(false);
  });

  it('should toggle item expansion via clickItem', () => {
    const item = {
      label: 'Parent',
      expanded: false,
      children: [{ label: 'Child' }],
    };
    component.clickItem(item);
    expect(item.expanded).toBe(true);
  });

  it('should set styleClass', () => {
    expect(component.styleClass).toContain('fab');
    expect(component.styleClass).toContain('menu');
    expect(component.styleClass).toContain('wide');
  });
});
