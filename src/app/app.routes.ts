import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./form-component/form.component').then((m) => m.AppFormComponent),
    canDeactivate: [unsavedChangesGuard]
  },
];
