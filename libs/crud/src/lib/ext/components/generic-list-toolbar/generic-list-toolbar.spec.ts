import { NO_ERRORS_SCHEMA } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideUiConfig } from '@nucleus/ui';
import { ConfirmationService } from 'primeng/api';
import { GenericListToolbar } from './generic-list-toolbar';

describe('GenericListToolbar', () => {
  let component: GenericListToolbar;
  let fixture: ComponentFixture<GenericListToolbar>;

  const mockConfig = {
    icon: { dir: 'icons' },
    message: { duration: 5000 },
    verification: { duration: 60, length: 6 },
  };

  const mockToolbar = { left: [], right: [] };
  const mockPagination = {
    first: 0,
    page: 0,
    rows: 10,
    total: 50,
    pages: 5,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericListToolbar],
      providers: [provideRouter([]), provideUiConfig(mockConfig), ConfirmationService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericListToolbar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('toolbar', mockToolbar);
    fixture.componentRef.setInput('pagination', mockPagination);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have toolbar input', () => {
    expect(component.toolbar()).toBe(mockToolbar);
  });

  it('should have pagination model', () => {
    expect(component.pagination()).toEqual(mockPagination);
  });

  it('should have default showPaginator as true', () => {
    expect(component.showPaginator()).toBe(true);
  });

  it('should create paginator label', () => {
    const label = component.paginatorLabel();
    expect(label).toContain('Rows 1 - 10 of 50');
    expect(label).toContain('Page 1 of 5');
  });

  it('should include selected count in label when selectedRecords > 0', () => {
    fixture.componentRef.setInput('selectedRecords', 3);
    fixture.detectChanges();
    const label = component.paginatorLabel();
    expect(label).toContain('3 Selected');
  });

  it('should paginate', () => {
    component.paginate({ first: 10, page: 1, rows: 10 });
    expect(component.pagination().first).toBe(10);
    expect(component.pagination().page).toBe(1);
    expect(component.pagination().rows).toBe(10);
  });
});
