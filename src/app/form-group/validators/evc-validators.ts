import { AbstractControl, FormControl, ValidatorFn } from "@angular/forms";
import { FormError } from "../form-error-types";
import { FormValidationErrorKeys } from "../form-validation-keys";

/**
 * Type definition for validation errors that ensures type safety.
 * Maps error keys to their corresponding error objects.
 */
export type FormValidationErrors = {
  [keys in FormValidationErrorKeys]:{
    [key in keys] : Readonly<FormError>
  }
}[FormValidationErrorKeys]

/**
 * Enhanced validator function interface that returns typed validation errors.
 * Extends Angular's ValidatorFn with better type safety.
 */
export interface EvcValidator extends ValidatorFn{
  (control : FormControl) : FormValidationErrors | null
}

/**
 * Collection of reusable, type-safe validators for common form validation scenarios.
 * All validators return consistent error structures for better error handling.
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   email: ['', [EvcValidators.customRequiredValidator(), EvcValidators.customEmailValidator()]]
 * });
 * ```
 */
export class EvcValidators {
  /**
   * Custom required field validator with localized error messages.
   *
   * @returns Validator function that checks if the field has a value
   * @example
   * ```typescript
   * this.fb.control('', [EvcValidators.customRequiredValidator()])
   * ```
   */
  public static customRequiredValidator(): EvcValidator {
    return (control: AbstractControl): FormValidationErrors | null => {
      return control.value ? null : { required: { message: 'This field is required.' } }; // use localization here
    };
  }

  /**
   * Custom email format validator using regex pattern.
   * Validates standard email format: username@domain.extension
   *
   * @returns Validator function that checks email format
   * @example
   * ```typescript
   * this.fb.control('', [EvcValidators.customEmailValidator()])
   * ```
   */
  public static customEmailValidator(): EvcValidator {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return (control: AbstractControl): FormValidationErrors | null => {
      return emailRegex.test(control.value) ? null : { validEmail: { message: 'Invalid email address.' } };
    };
  }

  /**
   * Custom zip code validator that supports multiple country formats.
   * Currently supports Canada (A1A 1A1) and United States (12345 or 12345-6789).
   *
   * @param countryCode - Two-letter country code (CA, US)
   * @returns Validator function that validates zip code format for the specified country
   * @example
   * ```typescript
   * this.fb.control('', [EvcValidators.customZipCodeValidator('CA')])
   * ```
   */
  public static customZipCodeValidator(countryCode: string): EvcValidator {
    return (control: AbstractControl): FormValidationErrors | null => {
      if (!control.value) return null;

      let zipCodeRegex: RegExp;
      switch (countryCode.toUpperCase()) {
        case 'CA': // Canada
          zipCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
          break;
        case 'US': // United States
          zipCodeRegex = /^\d{5}(-\d{4})?$/;
          break;
        // Add more country-specific formats as needed
        default:
          return { validCountry: { message: 'Invalid country code.' } };
      }

      return zipCodeRegex.test(control.value) ? null : { validZipCode: { message: 'Invalid zip code.' } };
    };
  }

}
