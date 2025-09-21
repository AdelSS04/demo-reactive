import { Directive, HostListener, Inject } from '@angular/core';
import { FORM_COMPONENT_TOKEN, FormWithUnsavedChanges } from '../guards/unsaved-changes.guard';

/**
 * Directive that prevents the user from accidentally leaving the page
 * when there are unsaved changes in a form.
 *
 * This directive listens to the browser's beforeunload event and shows
 * a confirmation dialog if the form has unsaved changes (is dirty).
 *
 * @example
 * ```typescript
 * @Component({
 *   hostDirectives: [UnsavedChangesDirective],
 *   providers: [
 *     { provide: FORM_COMPONENT_TOKEN, useExisting: MyFormComponent }
 *   ]
 * })
 * export class MyFormComponent implements FormWithUnsavedChanges {
 *   form = this.fb.group({ ... });
 * }
 * ```
 */
@Directive({
  selector: '[appUnsavedChanges]',
  standalone: true
})
export class UnsavedChangesDirective {
  constructor(@Inject(FORM_COMPONENT_TOKEN) private component: FormWithUnsavedChanges) {}

  /**
   * Handles the browser's beforeunload event to warn users about unsaved changes
   * @param event - The beforeunload event
   * @returns false if there are unsaved changes (triggers browser warning), true otherwise
   */
  @HostListener('window:beforeunload')
  onBeforeUnload(event: BeforeUnloadEvent): boolean {
    return !this.component.form.dirty
  }
}
