import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { UiMenuBuilder } from '../../../int/services';
import type { UiMenuItemModel } from '../../models/menu-item.model';
import { provideUiConfig } from '../../providers';
import { UiCssSupport } from '../../services/css-support';
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

  it('should run the item command on click', () => {
    const command = vi.fn();
    const item = { label: 'Cmd', command };
    component.onClick(item);
    expect(command).toHaveBeenCalledWith(item);
  });

  it('should keep an item-specific active style override', () => {
    fixture.componentRef.setInput('uiMenu', [
      { label: 'X', active: { iconVariant: 'outline' } },
    ] as UiMenuItemModel[]);
    fixture.detectChanges();
    expect(component.items()[0].active).toBeTruthy();
  });

  describe('sliding submenu expansion', () => {
    it('should expand parents that contain active children', () => {
      fixture.componentRef.setInput('uiMenu', [
        { label: 'Parent', children: [{ label: 'Child', isActive: true }] },
      ] as UiMenuItemModel[]);
      fixture.detectChanges();
      expect(component.items()[0].expanded).toBe(true);
    });

    it('should keep parents collapsed without active children', () => {
      fixture.componentRef.setInput('uiMenu', [
        { label: 'Parent', children: [{ label: 'Child' }] },
      ] as UiMenuItemModel[]);
      fixture.detectChanges();
      expect(component.items()[0].expanded).toBeFalsy();
    });

    it('should not force expansion for floating submenus', () => {
      fixture.componentRef.setInput('submenuMode', 'floating');
      fixture.componentRef.setInput('uiMenu', [
        { label: 'Parent', children: [{ label: 'Child', isActive: true }] },
      ] as UiMenuItemModel[]);
      fixture.detectChanges();
      expect(component.items()[0].expanded).toBeFalsy();
    });
  });

  describe('router navigation', () => {
    let router: Router;

    beforeEach(() => {
      router = TestBed.inject(Router);
    });

    it('should activate the item for the new url and deactivate the previous one', async () => {
      await router.navigateByUrl('/about').catch(() => undefined);
      expect(component.items()[1].isActive).toBe(true);
      expect(component.items()[0].isActive).toBeFalsy();

      await router.navigateByUrl('/').catch(() => undefined);
      expect(component.items()[0].isActive).toBe(true);
      expect(component.items()[1].isActive).toBe(false);
    });

    it('should ignore urls that match no item', async () => {
      await router.navigateByUrl('/about').catch(() => undefined);
      await router.navigateByUrl('/nowhere').catch(() => undefined);
      expect(component.items()[1].isActive).toBe(false);
      expect(component.items()[0].isActive).toBeFalsy();
    });
  });

  describe('with a previous url missing from the item map', () => {
    let localFixture: ComponentFixture<UiMenu>;
    let localComponent: UiMenu;
    let router: Router;

    beforeEach(async () => {
      history.replaceState({}, '', '/unmapped');
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [UiMenu],
        providers: [provideRouter([]), provideUiConfig(mockConfig), UiMenuBuilder],
      }).compileComponents();

      localFixture = TestBed.createComponent(UiMenu);
      localComponent = localFixture.componentInstance;
      localFixture.componentRef.setInput('uiMenu', [
        { label: 'A', routerLink: '/a' },
      ] as UiMenuItemModel[]);
      localFixture.detectChanges();
      router = TestBed.inject(Router);
    });

    afterEach(() => {
      localFixture.destroy();
      history.replaceState({}, '', '/');
    });

    it('should activate matching items without touching unmapped urls', async () => {
      await router.navigateByUrl('/a').catch(() => undefined);
      expect(localComponent.items()[0].isActive).toBe(true);

      await router.navigateByUrl('/nowhere').catch(() => undefined);
      expect(localComponent.items()[0].isActive).toBe(false);
    });

    it('should skip navigation handling without mapped items', async () => {
      const emptyFixture = TestBed.createComponent(UiMenu);
      emptyFixture.componentRef.setInput('uiMenu', [] as UiMenuItemModel[]);
      emptyFixture.detectChanges();

      await router.navigateByUrl('/a').catch(() => undefined);
      expect(emptyFixture.componentInstance.items()).toHaveLength(0);
      emptyFixture.destroy();
    });
  });

  describe('when calc-size is unsupported', () => {
    let localFixture: ComponentFixture<UiMenu>;
    let localComponent: UiMenu;
    let sizesSpy: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [UiMenu],
        providers: [
          provideRouter([]),
          provideUiConfig(mockConfig),
          UiMenuBuilder,
          { provide: UiCssSupport, useValue: { calcSize: () => false } },
        ],
      }).compileComponents();

      sizesSpy = vi.spyOn(TestBed.inject(UiMenuBuilder), 'calculateItemSizes');

      localFixture = TestBed.createComponent(UiMenu);
      localComponent = localFixture.componentInstance;
      localFixture.componentRef.setInput('uiMenu', [{ label: 'Item' }] as UiMenuItemModel[]);
      localFixture.detectChanges();
    });

    afterEach(() => localFixture.destroy());

    it('should measure item sizes once items are ready', () => {
      expect(sizesSpy).toHaveBeenCalledWith(localComponent.items());
    });

    it('should measure item sizes when a sliding leaf item is clicked', () => {
      sizesSpy.mockClear();
      localComponent.onClick({ label: 'Leaf' });
      expect(sizesSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('style fallbacks', () => {
    const setInput = (target: ComponentFixture<UiMenu>, name: string, value: unknown) =>
      (target.componentRef as { setInput: (n: string, v: unknown) => void }).setInput(name, value);

    it('should survive undefined style inputs', () => {
      const localFixture = TestBed.createComponent(UiMenu);
      setInput(localFixture, 'uiMenu', [{ label: 'X' }]);
      setInput(localFixture, 'defaultStyle', undefined);
      setInput(localFixture, 'activeStyle', undefined);
      expect(localFixture.componentInstance.items()[0].label).toBe('X');
      localFixture.destroy();
    });

    it('should fall back when the default style has no ngClass', () => {
      const localFixture = TestBed.createComponent(UiMenu);
      setInput(localFixture, 'defaultStyle', { iconVariant: 'filled' });
      setInput(localFixture, 'uiMenu', [{ label: 'X' }]);
      expect(localFixture.componentInstance.items()[0].label).toBe('X');
      localFixture.destroy();
    });
  });
});
