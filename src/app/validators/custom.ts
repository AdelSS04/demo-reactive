import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function customRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value ? null : { required: { message: 'This field is required.' } };
  };
}

// Custom email validator
export function customEmailValidator(): ValidatorFn {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    return emailRegex.test(control.value) ? null : { email: { message: 'Invalid email address.' } };
  };
}

// Custom zip code validator
export function customZipCodeValidator(countryCode: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
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
        return { invalidCountry: { message: 'Invalid country code.' } };
    }

    return zipCodeRegex.test(control.value) ? null : { zipCode: { message: 'Invalid zip code.' } };
  };
}
