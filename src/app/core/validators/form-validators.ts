import { AbstractControl, FormControl, ValidatorFn } from "@angular/forms";

/**
 * Standard error structure for form validation
 */
export interface FormError {
  message: string;
}

/**
 * Available validation error keys
 */
export type FormErrorKey = 'required' | 'validEmail' | 'validZipCode' | 'validCountry' | 'minLength' | 'maxLength';

/**
 * Type definition for form validation errors that ensures type safety
 */
export type FormValidationErrors = {
  [K in FormErrorKey]?: FormError;
};

/**
 * Enhanced validator function interface that returns typed validation errors
 */
export interface FormValidator extends ValidatorFn {
  (control: FormControl): FormValidationErrors | null;
}

/**
 * Collection of reusable, type-safe validators for form validation
 * All validators return consistent error structures
 *
 * @example
 * ```typescript
 * const form = this.fb.group({
 *   email: ['', [FormValidators.required(), FormValidators.email()]]
 * });
 * ```
 */
export class FormValidators {
  /**
   * Required field validator
   */
  static required(): FormValidator {
    return (control: AbstractControl): FormValidationErrors | null => {
      return control.value?.trim() ? null : { required: { message: 'This field is required.' } };
    };
  }

  /**
   * Email format validator
   */
  static email(): FormValidator {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return (control: AbstractControl): FormValidationErrors | null => {
      if (!control.value) return null;
      return emailRegex.test(control.value) ? null : { validEmail: { message: 'Invalid email address.' } };
    };
  }

  /**
   * Zip/Postal code validator for specific countries
   */
  static zipCode(countryCode: string): FormValidator {
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
        default:
          return { validCountry: { message: 'Invalid country code.' } };
      }

      return zipCodeRegex.test(control.value) ? null : { validZipCode: { message: 'Invalid zip/postal code.' } };
    };
  }

  /**
   * Minimum length validator
   */
  static minLength(minLength: number): FormValidator {
    return (control: AbstractControl): FormValidationErrors | null => {
      if (!control.value) return null;
      return control.value.length >= minLength ? null : {
        minLength: { message: `Minimum length is ${minLength} characters.` }
      };
    };
  }

  /**
   * Maximum length validator
   */
  static maxLength(maxLength: number): FormValidator {
    return (control: AbstractControl): FormValidationErrors | null => {
      if (!control.value) return null;
      return control.value.length <= maxLength ? null : {
        maxLength: { message: `Maximum length is ${maxLength} characters.` }
      };
    };
  }
}
