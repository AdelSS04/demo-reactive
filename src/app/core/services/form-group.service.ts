import {
  computed,
  DestroyRef,
  EventEmitter,
  Injectable,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormError, FormErrorWithKey } from '../../form-group/form-error-types';
import { FormErrorCollector } from '../../form-group/services/helpers/form-error-collector';

/**
 * Service for managing reactive form state, validation, and error handling.
 * Provides centralized form management with type-safe error collection and
 * automatic validation state tracking.
 *
 * Features:
 * - Automatic form validation monitoring
 * - Type-safe error collection and display
 * - Form state management (pristine, dirty, valid)
 * - Integration with Angular reactive forms
 *
 * @example
 * ```typescript
 * @Component({
 *   providers: [FormGroupService]
 * })
 * export class MyComponent {
 *   constructor(private formService: FormGroupService) {}
 *
 *   ngOnInit() {
 *     this.formService.bind(this.form, this.formDirective, this.destroyRef);
 *   }
 * }
 * ```
 */
@Injectable()
export class FormGroupService {
  /** Signal containing all form validation errors as a Map */
  private _errors = signal<Map<string, FormError>>(new Map());

  /** Signal tracking if the form is currently valid */
  private _isValid = signal<boolean>(true);

  /** Signal tracking if the form has been modified */
  private _isDirty = signal<boolean>(false);

  /** Signal tracking if any form controls have been touched */
  private _isTouched = signal<boolean>(false);

  /** Event emitter for form submission attempts */
  readonly formSubmitted = new EventEmitter<void>();

  /** Computed signal providing read-only access to form errors */
  readonly errors = computed(() => this._errors());

  /** Computed signal providing validation state */
  readonly isValid = computed(() => this._isValid());

  /** Computed signal providing dirty state */
  readonly isDirty = computed(() => this._isDirty());

  /** Computed signal providing touched state */
  readonly isTouched = computed(() => this._isTouched());

  /**
   * Binds the service to a form group and form directive for automatic monitoring.
   * Sets up subscriptions to track form state changes and validation errors.
   *
   * @param formGroup - The FormGroup to monitor
   * @param formDirective - The FormGroupDirective for additional form operations
   * @param destroyRef - DestroyRef for automatic subscription cleanup
   */
  bind(
    formGroup: FormGroup,
    formDirective: FormGroupDirective,
    destroyRef: DestroyRef
  ): void {
    // Monitor form status changes
    formGroup.statusChanges
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        this._isValid.set(formGroup.valid);
        this.updateErrors(formGroup);
      });

    // Monitor form value changes for dirty state
    formGroup.valueChanges
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        this._isDirty.set(formGroup.dirty);
        this._isTouched.set(formGroup.touched);
      });

    // Monitor form submission
    formDirective.ngSubmit
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        this.formSubmitted.emit();
        this.updateErrors(formGroup);
      });

    // Initial error state
    this.updateErrors(formGroup);
  }

  /**
   * Updates the internal error state by collecting all validation errors from the form.
   * Uses the FormErrorCollector to traverse the form tree and gather errors.
   *
   * @param formGroup - The form group to collect errors from
   */
  private updateErrors(formGroup: FormGroup): void {
    const errorsMap = new Map<string, FormErrorWithKey>();
    const errorCollector = new FormErrorCollector(errorsMap, true);

    // Collect errors from all form controls
    this.visitFormControls(formGroup, errorCollector);

    // Convert FormErrorWithKey to FormError for storage
    const simpleErrors = new Map<string, FormError>();
    errorsMap.forEach((errorWithKey, key) => {
      simpleErrors.set(key, { message: errorWithKey.message });
    });

    this._errors.set(simpleErrors);
  }

  /**
   * Recursively visits all form controls and applies the collector action
   * @param formGroup - The form group to traverse
   * @param collector - The error collector to apply to each control
   */
  private visitFormControls(formGroup: FormGroup, collector: FormErrorCollector): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        collector.action(key, control);

        // Recursively process nested form groups
        if (control instanceof FormGroup) {
          this.visitFormControls(control, collector);
        }
      }
    });
  }

  /**
   * Gets all form errors as a Map for programmatic access.
   * @returns Map of field names to FormError objects
   */
  getFormErrors(): Map<string, FormError> {
    return this._errors();
  }

  /**
   * Gets errors for a specific form control by name.
   * @param controlName - The name of the form control
   * @returns FormError object if exists, null otherwise
   */
  getControlError(controlName: string): FormError | null {
    return this._errors().get(controlName) || null;
  }

  /**
   * Checks if a specific form control has validation errors.
   * @param controlName - The name of the form control
   * @returns True if the control has errors, false otherwise
   */
  hasControlError(controlName: string): boolean {
    return this._errors().has(controlName);
  }

  /**
   * Gets the total number of validation errors in the form.
   * @returns Number of validation errors
   */
  getErrorCount(): number {
    return this._errors().size;
  }

  /**
   * Clears all validation errors from the service.
   * Useful for manual error state reset.
   */
  clearErrors(): void {
    this._errors.set(new Map());
  }

  /**
   * Manually adds a validation error for a specific control.
   * Useful for server-side validation errors.
   *
   * @param controlName - The name of the form control
   * @param error - The error object to add
   */
  addError(controlName: string, error: FormError): void {
    const currentErrors = new Map(this._errors());
    currentErrors.set(controlName, error);
    this._errors.set(currentErrors);
  }

  /**
   * Removes a validation error for a specific control.
   * @param controlName - The name of the form control
   */
  removeError(controlName: string): void {
    const currentErrors = new Map(this._errors());
    currentErrors.delete(controlName);
    this._errors.set(currentErrors);
  }

  /**
   * Validates the entire form and updates error state.
   * Useful for manual validation triggers.
   *
   * @param formGroup - The form group to validate
   * @returns True if form is valid, false otherwise
   */
  validateForm(formGroup: FormGroup): boolean {
    // Mark all controls as touched to show validation errors
    this.markFormGroupTouched(formGroup);

    // Update error state
    this.updateErrors(formGroup);

    return formGroup.valid;
  }

  /**
   * Recursively marks all controls in a form group as touched.
   * This ensures validation errors are displayed for all fields.
   *
   * @param formGroup - The form group to mark as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      }
    });
  }
}
