import { AbstractControl, FormControl, ValidatorFn } from "@angular/forms";
import { EvcError } from "../evc-erreur";
import { EvcCleError } from "../evc-key-error";

export type EvcValidatonErrors = {
  [keys in EvcCleError]:{
    [key in keys] : Readonly<EvcError>
  }
}[EvcCleError]

export interface EvcValidator extends ValidatorFn{
  (control : FormControl) : EvcValidatonErrors | null
}

export class EvcValidators {
  public static customRequiredValidator(): EvcValidator {
    return (control: AbstractControl): EvcValidatonErrors | null => {
      return control.value ? null : { required: { message: 'This field is required.' } }; // use localization here ¸¸
    };
  }

  // Custom email validator
  public static customEmailValidator(): EvcValidator {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return (control: AbstractControl): EvcValidatonErrors | null => {
      return emailRegex.test(control.value) ? null : { validEmail: { message: 'Invalid email address.' } };
    };
  }

  // Custom zip code validator
  public static customZipCodeValidator(countryCode: string): EvcValidator {
    return (control: AbstractControl): EvcValidatonErrors | null => {
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
