// src/app/app.routes.ts
// Lazy-loaded routes for dashboard and form pages

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'bp/new',
    loadComponent: () =>
      import('./components/bp-form/bp-form.component')
        .then(m => m.BpFormComponent)
  },
  {
    path: 'bp/edit/:id',
    loadComponent: () =>
      import('./components/bp-form/bp-form.component')
        .then(m => m.BpFormComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
