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
import { UserProfileAdressFormGroup, UserProfileAdressModel } from '../../formGroup/userProfile-form-group';
import { TypedFormGroup } from '../../form-group/helpers/typed-form-group';
import { FormGroupService } from '../../core/services/form-group.service';
import { FormValidators } from '../../core/validators/form-validators';
import { InputComponent } from '../../input/input.component';
import { DecimalFormatPipe } from '../../shared/pipes/decimal-format.pipe';
import { PhoneFormatPipe } from '../../shared/pipes/phone-format.pipe';

@Component({
  selector: 'user-address',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    InputComponent,
    DecimalFormatPipe
  ],
  templateUrl: './adress.component.html',
  providers: [FormGroupService,DecimalFormatPipe,PhoneFormatPipe],
})
export class AdressComponent<TFormGroupParent extends TypedFormGroup<{ address?: FormGroup<UserProfileAdressFormGroup> | undefined }>,> implements OnInit {
  formGroupParent = input<TFormGroupParent>();
  model = input.required<UserProfileAdressModel | undefined>()
  myForm!: FormGroup<UserProfileAdressFormGroup>;
  private fb = inject(FormBuilder);
  ngOnInit(): void {
    this.myForm = this.fb.group<UserProfileAdressFormGroup>({
      country: this.fb.nonNullable.control(this.model()?.country ?? "", [FormValidators.required()]),
      address: this.fb.nonNullable.control(this.model()?.address ?? "", [FormValidators.required()]),
      zipCode: this.fb.nonNullable.control(this.model()?.zipCode ?? "", [
        FormValidators.required(),
        FormValidators.zipCode("CA"),
      ]),
      city: this.fb.nonNullable.control(this.model()?.city ?? "", [FormValidators.required()]),
    });
    this.formGroupParent()?.setControl("address",this.myForm)
  }
}
