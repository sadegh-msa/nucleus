import type { Route } from '@angular/router';
import { PageType, pagePathPattern } from '@nucleus/core/crud';

const { List, View, Add, Edit } = PageType;
const { list, view, add, edit } = pagePathPattern;

const loadListComponent = () =>
  import('./components/sample-list/sample-list').then((m) => m.SampleList);
const loadFormComponent = () =>
  import('./components/sample-form/sample-form').then((m) => m.SampleForm);

export const sampleRoutes: Route[] = [
  { path: '', redirectTo: list, pathMatch: 'full' },
  { path: list, loadComponent: loadListComponent, data: { pageType: List } },
  { path: view, loadComponent: loadFormComponent, data: { pageType: View } },
  { path: add, loadComponent: loadFormComponent, data: { pageType: Add } },
  { path: edit, loadComponent: loadFormComponent, data: { pageType: Edit } },
];
