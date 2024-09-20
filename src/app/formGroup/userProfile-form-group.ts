import { FormArray, FormControl, FormGroup } from "@angular/forms";

type EvcRecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? EvcRecursivePartial<T[P]> : T[P];
};

type EvcFormModel<T>  = {
  [K in keyof T]
  : T[K] extends FormControl<infer U>
  ? U
  : T[K] extends (FormControl<infer U> | undefined)
  ? (U | undefined)
  : T[K] extends FormArray<FormControl<infer U>>
  ? Array<U>
  : T[K] extends (FormArray<FormControl<infer U>> | undefined)
  ? (Array<U> | undefined)
  : T[K] extends FormArray<FormGroup<infer U>>
  ? Array<Partial<EvcFormModel<U>>>
  : T[K] extends (FormArray<FormGroup<infer U>> | undefined)
  ? (Array<Partial<EvcFormModel<U>>> | undefined)
  : T[K] extends FormGroup<infer U>
  ? Partial<EvcFormModel<U>>
  : T[K] extends (FormGroup<infer U> | undefined)
  ? (Partial<EvcFormModel<U>> | undefined)
  : T[K]
}
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
  address?: FormGroup<UserProfileAdressFormGroup> | undefined;
}

export type UserProfileAdressModel = Partial<EvcFormModel<UserProfileAdressFormGroup>>

export type UserProfileModel = Partial<EvcFormModel<UserProfileFormGroup>>
