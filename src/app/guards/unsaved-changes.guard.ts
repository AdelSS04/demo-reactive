import { InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Interface for components that have forms with potentially unsaved changes.
 * Components implementing this interface can be used with the unsaved changes guard.
 */
export interface FormWithUnsavedChanges {
  /** The form instance that may contain unsaved changes */
  form: FormGroup;
}

/**
 * Injection token for providing form components to directives and services.
 * Used to access the form instance from components that implement FormWithUnsavedChanges.
 */
export const FORM_COMPONENT_TOKEN = new InjectionToken<FormWithUnsavedChanges>('FormComponent');

/**
 * Route guard that prevents navigation away from a page when there are unsaved form changes.
 * 
 * This guard checks if the form is dirty (has unsaved changes) and prompts the user
 * for confirmation before allowing navigation away from the current route.
 * 
 * @param component - The component implementing FormWithUnsavedChanges interface
 * @param _currentRoute - The current activated route (unused)
 * @param _currentState - The current router state (unused)
 * @param nextState - The target router state for navigation
 * @returns Observable<boolean> - true if navigation is allowed, false otherwise
 * 
 * @example
 * ```typescript
 * // In your routes configuration
 * const routes: Routes = [
 *   {
 *     path: 'form',
 *     component: FormComponent,
 *     canDeactivate: [unsavedChangesGuard]
 *   }
 * ];
 * ```
 */
export const unsavedChangesGuard: CanDeactivateFn<FormWithUnsavedChanges> = (
  component: FormWithUnsavedChanges,
  _currentRoute: ActivatedRouteSnapshot,
  _currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
): Observable<boolean> => {
  // Allow navigation to error pages or if form is not dirty
  if (nextState?.url === '/error-page-route' || !component.form.dirty) {
    return of(true);
  } else {
    // Prompt user for confirmation when there are unsaved changes
    const confirmLeave = window.confirm('You have unsaved changes. Do you really want to leave?');
    return of(confirmLeave);
  }
};
