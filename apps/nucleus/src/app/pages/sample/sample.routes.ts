import { Route } from '@angular/router';
import { pagePathPattern, PageType } from '@nucleus/core';

const { List, View, Add, Edit } = PageType;
const { list, view, add, edit } = pagePathPattern;

const loadListComponent = () => import('./components/sample-list/sample-list.component').then(m => m.SampleListComponent);
const loadFormComponent = () => import('./components/sample-form/sample-form.component').then(m => m.SampleFormComponent);

export const sampleRoutes: Route[] = [
  { path: '', redirectTo: list, pathMatch: 'full' },
  { path: list, loadComponent: loadListComponent, data: { pageType: List } },
  { path: view, loadComponent: loadFormComponent, data: { pageType: View } },
  { path: add, loadComponent: loadFormComponent, data: { pageType: Add } },
  { path: edit, loadComponent: loadFormComponent, data: { pageType: Edit } }
];
