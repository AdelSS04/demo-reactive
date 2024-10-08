import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  input,
  OnInit,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { UserProfileAdressFormGroup, UserProfileAdressModel } from '../../formGroup/userProfile-form-group';
import { FormGroupWithControls } from '../../form-group/helpers/evc-form-group-types';
import { EvcFormGroupService } from '../../form-group/services/evc-form-group-service.service';
import { EvcValidators } from '../../form-group/validators/evc-validators';
import { InputComponent } from '../../input/input.component';
import { DecimalFormatPipe } from '../../pipes/decimalFormatPipe.pipe';
import { PhoneFormatPipe } from '../../pipes/phoneFormat.pipe';
import { ErrorListComponent } from '../evc-error-from-group.cmponent';

@Component({
  selector: 'evc-user-address',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    InputComponent,
    ErrorListComponent,
    AsyncPipe,
    DecimalFormatPipe
  ],
  templateUrl: './adress.component.html',
  providers: [EvcFormGroupService,DecimalFormatPipe,PhoneFormatPipe],
})
export class AdressComponent<TFormGroupParent extends FormGroupWithControls<{ address?: FormGroup<UserProfileAdressFormGroup> | undefined }>,> implements OnInit {
  formGroupParent = input<TFormGroupParent>();
  model = input.required<UserProfileAdressModel | undefined>()
  myForm!: FormGroup<UserProfileAdressFormGroup>;
  private fb = inject(FormBuilder);
  ngOnInit(): void {
    this.myForm = this.fb.group<UserProfileAdressFormGroup>({
      country: this.fb.nonNullable.control(this.model()?.country ?? "", [EvcValidators.customRequiredValidator()]),
      address: this.fb.nonNullable.control(this.model()?.address ?? "", [EvcValidators.customRequiredValidator()]),
      zipCode: this.fb.nonNullable.control(this.model()?.zipCode ?? "", [
        EvcValidators.customRequiredValidator(),
        EvcValidators.customZipCodeValidator("CA"),
      ]),
      city: this.fb.nonNullable.control(this.model()?.city ?? "", [EvcValidators.customRequiredValidator()]),
    });
    this.formGroupParent()?.setControl("address",this.myForm)
  }
}
