import { InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';

export interface canOutForm {
  form: FormGroup;
}
export const OUR_FORM = new InjectionToken<canOutForm>('OurForm');

export const outFormGuard: CanDeactivateFn<canOutForm> = (
  component: canOutForm,
  _currentroute: ActivatedRouteSnapshot,
  _currentstate: RouterStateSnapshot,
  nextState: RouterStateSnapshot
): Observable<boolean> => {
  if(nextState?.url === '/error-page-route' || !component.form.dirty)
    return of(true)
  else {
    const confirmLeave = window.confirm('You have unsaved changes. Do you really want to leave?');
    return of(confirmLeave);
  }
};
