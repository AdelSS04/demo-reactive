import { FormControl, FormGroup } from "@angular/forms";

export type UserProfileAdressFormGroup = {
  country: FormControl<string>;
  address: FormControl<string>;
  zipCode: FormControl<string>;
  city: FormControl<string>;
}

export type UserProfileFormGroup = {
  name: FormControl<string>;
  lastName: FormControl<string>;
  email?: FormControl<string>;
  phoneNumber: FormControl<string>;
  money: FormControl<string>;
  address?: FormGroup<UserProfileAdressFormGroup>;
}
