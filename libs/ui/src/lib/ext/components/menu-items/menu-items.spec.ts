import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideUiConfig } from '../../providers';
import { UiMenuItems } from './menu-items';

describe('UiMenuItems', () => {
  let component: UiMenuItems;
  let fixture: ComponentFixture<UiMenuItems>;

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
      imports: [UiMenuItems],
      providers: [provideRouter([]), provideUiConfig(mockConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMenuItems);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('uiMenuItems', mockItems);
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
    component.onClick(item);
    expect(item.expanded).toBe(false);
    expect(item.children?.[0].expanded).toBe(false);
  });

  it('should toggle item expansion via clickItem', () => {
    const item = {
      label: 'Parent',
      expanded: false,
      children: [{ label: 'Child' }],
    };
    component.onClick(item);
    expect(item.expanded).toBe(true);
  });

  it('should set styleClass', () => {
    const styleClass = component.styleClass();

    expect(styleClass).toContain('ui');
    expect(styleClass).toContain('menu');
    expect(styleClass).toContain('wide');
  });

  it('should have default styleClass as wide', () => {
    const styleClass = component.styleClass();

    expect(styleClass).toContain('ui');
    expect(styleClass).toContain('menu');
    expect(styleClass).toContain('wide');
    expect(styleClass).toContain('still');
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

  it('should have default submenuMode as sliding', () => {
    expect(component.submenuMode()).toBe('sliding');
  });

  it('should have default popoverPlacement as inline-end-edge-end', () => {
    expect(component.popoverPlacement()).toBe('inline-end-edge-end');
  });

  it('should have default tooltipPlacement as inline-end-block-center', () => {
    expect(component.tooltipPlacement()).toBe('inline-end-block-center');
  });

  it('should collapse items when isSubmenuFloating and isCompact', () => {
    const item = {
      label: 'Parent',
      expanded: true,
      children: [{ label: 'Child', expanded: true }],
    };

    fixture.componentRef.setInput('uiMenuItems', [item]);
    fixture.componentRef.setInput('submenuMode', 'floating');
    fixture.componentRef.setInput('extent', 'compact');
    fixture.detectChanges();

    expect(item.expanded).toBe(false);
    expect(item.children?.[0].expanded).toBe(false);
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
});
