import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideUiConfig } from '../../providers';
import { UiMenuBuilder } from '../../services/menu-builder';
import { UiMenu } from './menu';

describe('UiMenu', () => {
  let component: UiMenu;
  let fixture: ComponentFixture<UiMenu>;
  let _menuBuilder: UiMenuBuilder;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
    menu: {
      extent: 'wide',
      mode: 'still',
      submenuMode: 'sliding',
      popoverPlacement: 'inline-end-edge-end',
      tooltipPlacement: 'inline-end-block-center',
      item: {
        icon: { variant: { default: 'filled', active: 'filled' } },
      },
    },
  };

  const mockItems = [
    { label: 'Home', routerLink: '/' },
    { label: 'About', routerLink: '/about' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMenu],
      providers: [provideRouter([]), provideUiConfig(mockConfig), UiMenuBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMenu);
    component = fixture.componentInstance;
    _menuBuilder = TestBed.inject(UiMenuBuilder);
    fixture.componentRef.setInput('uiMenu', mockItems);
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

  it('should have default submenuMode as sliding', () => {
    expect(component.submenuMode()).toBe('sliding');
  });

  it('should have default popoverPlacement', () => {
    expect(component.popoverPlacement()).toBe('inline-end-edge-end');
  });

  it('should have default tooltipPlacement', () => {
    expect(component.tooltipPlacement()).toBe('inline-end-block-center');
  });

  it('should compute isSubmenuFloating for compact extent', () => {
    fixture.componentRef.setInput('extent', 'compact');
    fixture.detectChanges();
    expect(component.isSubmenuFloating()).toBe(true);
  });

  it('should compute isSubmenuFloating for floating submenuMode', () => {
    fixture.componentRef.setInput('submenuMode', 'floating');
    fixture.detectChanges();
    expect(component.isSubmenuFloating()).toBe(true);
  });

  it('should compute isSubmenuSliding correctly', () => {
    fixture.componentRef.setInput('extent', 'wide');
    fixture.componentRef.setInput('submenuMode', 'sliding');
    fixture.detectChanges();
    expect(component.isSubmenuSliding()).toBe(true);
  });

  it('should update styleClass when extent changes', () => {
    const styleClassWide = component.styleClass();
    expect(styleClassWide).toContain('wide');

    fixture.componentRef.setInput('extent', 'compact');
    fixture.detectChanges();

    const styleClassCompact = component.styleClass();
    expect(styleClassCompact).toContain('compact');
    expect(styleClassCompact).not.toContain('wide');
  });

  it('should update styleClass when submenuMode changes', () => {
    let styleClass = component.styleClass();
    expect(styleClass).toContain('sliding');

    fixture.componentRef.setInput('submenuMode', 'floating');
    fixture.detectChanges();

    styleClass = component.styleClass();
    expect(styleClass).toContain('floating');
    expect(styleClass).not.toContain('sliding');
  });

  it('should set item activity via MenuBuilder', () => {
    const item = { label: 'Test', expanded: false };
    component.setItemActivity(item, true);
    expect(item.isActive).toBe(true);
    expect(item.original).toBeTruthy();
  });

  it('should clear item activity via MenuBuilder', () => {
    const item = { label: 'Test', expanded: false };
    component.setItemActivity(item, true);
    component.setItemActivity(item, false);
    expect(item.isActive).toBe(false);
    expect(item.original).toBeUndefined();
  });

  describe('onClick', () => {
    it('should expand collapsed item with children', () => {
      const item = {
        label: 'Parent',
        expanded: false,
        children: [{ label: 'Child' }],
      };
      component.onClick(item);
      expect(item.expanded).toBe(true);
    });

    it('should collapse expanded item with children', () => {
      const item = {
        label: 'Parent',
        expanded: true,
        children: [{ label: 'Child', expanded: true }],
      };
      component.onClick(item);
      expect(item.expanded).toBe(false);
      expect(item.children?.[0].expanded).toBe(false);
    });

    it('should collapse all items when clicking leaf in floating submenu', () => {
      const parent = {
        label: 'Parent',
        expanded: true,
        children: [{ label: 'Child', expanded: true }],
      };
      fixture.componentRef.setInput('uiMenu', [parent]);
      fixture.componentRef.setInput('submenuMode', 'floating');
      fixture.detectChanges();
      component.onClick(parent.children![0]);
      expect(parent.expanded).toBe(false);
      expect(parent.children?.[0].expanded).toBe(false);
    });
  });
});
