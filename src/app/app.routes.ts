import { Routes } from '@angular/router';
import { outFormGuard } from './guards/form-out.guard';

//export const routes: Routes = [];
export const routes: Routes = [
  {
    path: 'form',
    loadComponent: () =>
      import('./form-component/form.component').then((m) => m.AppFormComponent),
    canDeactivate: [outFormGuard]
  },
];
