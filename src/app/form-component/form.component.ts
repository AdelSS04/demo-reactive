import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { EvcApiErrors } from '../form-group/evc-erreur';
import { InputComponent } from '../input/input.component';
import { ErrorListComponent } from '../component/evc-error-from-group.cmponent';
import { AsyncPipe } from '@angular/common';
import { UserProfileFormGroup, UserProfileModel } from '../formGroup/userProfile-form-group';
import { DecimalFormatPipe } from '../pipes/decimalFormatPipe.pipe';
import { PhoneFormatPipe } from '../pipes/phoneFormat.pipe';
import { EvcFormGroupService } from '../form-group/services/evc-form-group-service.service';
import { EvcValidators } from '../form-group/validators/evc-validators';
import { AdressComponent } from '../component/adress/adress.component';
import { ZipCodeFormatPipe } from '../pipes/zipCodeFormatPipe.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, skip, startWith } from 'rxjs';
import { canOutForm, OUR_FORM } from '../guards/form-out.guard';
import { OutFormDirective } from '../directive/form-out.directive';

@Component({
  selector: 'app-form',
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
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [EvcFormGroupService,DecimalFormatPipe,PhoneFormatPipe,ZipCodeFormatPipe, { provide: OUR_FORM, useExisting:forwardRef(()=> AppFormComponent)  }],
  hostDirectives:[OutFormDirective]
})
export class AppFormComponent implements OnInit,canOutForm {
  groupService = inject(EvcFormGroupService);
  destoryRef = inject(DestroyRef);
  apiError = signal<EvcApiErrors[]>([]);
  form!: FormGroup<UserProfileFormGroup>;

  frm = viewChild.required(FormGroupDirective);
  private fb = inject(FormBuilder);
  router= inject(Router)
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
    this.form = this.fb.group<UserProfileFormGroup>({
      name: this.fb.nonNullable.control(this.model.name ?? "", [EvcValidators.customRequiredValidator()]),
      lastName: this.fb.nonNullable.control(this.model.lastName ?? "", [EvcValidators.customRequiredValidator()]),
      email: this.fb.nonNullable.control(this.model.email ?? "", [
        EvcValidators.customRequiredValidator(),
        EvcValidators.customEmailValidator(),
      ]),
      phoneNumber: this.fb.nonNullable.control(this.model.phoneNumber ?? "", [EvcValidators.customRequiredValidator()]),
      money: this.fb.nonNullable.control(this.model.money ?? "", [EvcValidators.customRequiredValidator()])
    });
    this.groupService.bind(this.form, this.frm(), this.destoryRef);
    this.form.valueChanges.pipe(
      skip(1),
      distinctUntilChanged(),
          takeUntilDestroyed(this.destoryRef)
    ).subscribe(val => {
      console.log(val);
    });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  title = 'my-angular-app';
  disable(){
    if (this.form.disabled) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
  submit() {
    console.log(this.form.pristine)
    var cc = structuredClone(this.form.value)
    console.log(cc)
    if(this.form.invalid &&
      Array.from(this.groupService.obtenirErreur().values()))
      console.info("failed")

    const erreurApi = [
      { message: 'message', code: 'code', propertyName: 'name' },
    ];
    this.apiError.set(erreurApi);
  }
}
