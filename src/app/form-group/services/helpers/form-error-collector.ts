import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormError, FormErrorWithKey } from '../../form-error-types';

/**
 * Interface for form control action handlers
 */
export interface FormControlAction {
  /**
   * Executes an action on a form control
   * @param key - The control key/name
   * @param control - The form control instance
   */
  action(key: string, control: AbstractControl): void;
}

/**
 * Utility class for extracting and collecting form validation errors.
 * Implements a visitor pattern to process form controls and gather their errors.
 * 
 * @example
 * ```typescript
 * const errorCollector = new FormErrorCollector(
 *   new Map<string, FormErrorWithKey>(),
 *   true // Only collect errors from touched controls
 * );
 * 
 * // Process a form control
 * errorCollector.action('email', emailControl);
 * 
 * // Access collected errors
 * const errors = errorCollector.errors;
 * ```
 */
export class FormErrorCollector implements FormControlAction {
  /**
   * Creates a new form error collector
   * @param errors - Map to store collected errors (key: control name, value: error info)
   * @param touchedControlsOnly - Whether to only collect errors from touched controls
   */
  constructor(
    public errors: Map<string, FormErrorWithKey>,
    public touchedControlsOnly = true
  ) {}

  /**
   * Processes a form control and collects any validation errors
   * @param key - The form control name/key
   * @param control - The form control to process
   */
  public action(key: string, control: AbstractControl): void {
    // Skip untouched controls if configured to do so
    if (this.touchedControlsOnly && control.untouched) return;
    
    const controlErrors: ValidationErrors | null = control.errors;
    if (controlErrors != null) {
      Object.entries(controlErrors).forEach(
        ([errorKey, error]: [string, FormError]) => {
          console.warn("Form validation error detected:", { key, errorKey, error });
          
          this.errors.set(key, {
            errorKey,
            message: error.message,
          });
        }
      );
    }
  }
}




