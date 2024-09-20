import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
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
import { EvcApiErrors } from './form-group/evc-erreur';
import { InputComponent } from './input/input.component';
import { ErrorListComponent } from './component/evc-error-from-group.cmponent';
import { AsyncPipe } from '@angular/common';
import { UserProfileFormGroup, UserProfileModel } from './formGroup/userProfile-form-group';
import { DecimalFormatPipe } from './pipes/decimalFormatPipe.pipe';
import { PhoneFormatPipe } from './pipes/phoneFormat.pipe';
import { EvcFormGroupService } from './form-group/services/evc-form-group-service.service';
import { EvcValidators } from './form-group/validators/evc-validators';
import { AdressComponent } from './component/adress/adress.component';
import { ZipCodeFormatPipe } from './pipes/zipCodeFormatPipe.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    InputComponent,
    ErrorListComponent,
    AsyncPipe,
    DecimalFormatPipe,
    AdressComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [EvcFormGroupService,DecimalFormatPipe,PhoneFormatPipe,ZipCodeFormatPipe],
})
export class AppComponent implements OnInit {
  groupService = inject(EvcFormGroupService);
  destoryRef = inject(DestroyRef);
  apiError = signal<EvcApiErrors[]>([]);
  myFormD!: FormGroup<UserProfileFormGroup>;

  frm = viewChild.required(FormGroupDirective);
  private fb = inject(FormBuilder);

  model : UserProfileModel ={
    "name": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "123-456-7890",
    "money": "1000",
    "address": {
      "country": "Canada",
      "address": "123 Maple Street",
      "zipCode": "K1A 0B1",
      "city": "Ottawa"
    }
  }
  ngOnInit(): void {
    this.myFormD = this.fb.group<UserProfileFormGroup>({
      name: this.fb.nonNullable.control(this.model.name ?? "", [EvcValidators.customRequiredValidator()]),
      lastName: this.fb.nonNullable.control(this.model.lastName ?? "", [EvcValidators.customRequiredValidator()]),
      email: this.fb.nonNullable.control(this.model.email ?? "", [
        EvcValidators.customRequiredValidator(),
        EvcValidators.customEmailValidator(),
      ]),
      phoneNumber: this.fb.nonNullable.control(this.model.phoneNumber ?? "", [EvcValidators.customRequiredValidator()]),
      money: this.fb.nonNullable.control(this.model.money ?? "", [EvcValidators.customRequiredValidator()])
    });
    this.groupService.bind(this.myFormD, this.frm(), this.destoryRef);
  }
  title = 'my-angular-app';
  disable(){
    if (this.myFormD.disabled) {
      this.myFormD.enable();
    } else {
      this.myFormD.disable();
    }
  }
  submit() {
    var cc = structuredClone(this.myFormD.value)
    console.log(cc)
    if(this.myFormD.invalid &&
      Array.from(this.groupService.obtenirErreur().values()))
      console.info("failed")

    const erreurApi = [
      { message: 'message', code: 'code', propertyName: 'name' },
    ];
    this.apiError.set(erreurApi);
  }
}
