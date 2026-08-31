import type { Route } from '@angular/router';
import { pagePathPattern } from '@nucleus/crud';

const { list, view, add, edit } = pagePathPattern;

const loadListComponent = () =>
  import('./components/sample-list/sample-list').then((m) => m.SampleList);
const loadFormComponent = () =>
  import('./components/sample-form/sample-form').then((m) => m.SampleForm);

export const sampleRoutes: Route[] = [
  { path: '', redirectTo: list, pathMatch: 'full' },
  { path: list, loadComponent: loadListComponent, data: { pageType: 'list' } },
  { path: view, loadComponent: loadFormComponent, data: { pageType: 'view' } },
  { path: add, loadComponent: loadFormComponent, data: { pageType: 'add' } },
  { path: edit, loadComponent: loadFormComponent, data: { pageType: 'edit' } },
];
