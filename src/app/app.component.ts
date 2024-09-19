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
import { FgServiceService } from './services/fg-service.service';
import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { EvcApiErrors } from './input/evc-erreur';
import { InputComponent } from './input/input.component';
import { ErrorListComponent } from './component/evc-error-from-group.cmponent';
import { AsyncPipe } from '@angular/common';
import { UserProfileFormGroup } from '../formGroup/userProfile-form-group';
import {
  customEmailValidator,
  customRequiredValidator,
} from './validators/custom';
import { DecimalFormatPipe } from './pipes/decimalFormatPipe.pipe';

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
    DecimalFormatPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [FgServiceService,DecimalFormatPipe],
})
export class AppComponent implements OnInit {
  groupService = inject(FgServiceService);
  destoryRef = inject(DestroyRef);
  apiError = signal<EvcApiErrors[]>([]);
  myForm!: FormGroup<UserProfileFormGroup>;
  myFormD!: FormGroup<UserProfileFormGroup>;

  frm = viewChild.required(FormGroupDirective);
  private fb = inject(FormBuilder);
  ngOnInit(): void {
    /*this.myForm = this.fb.group<UserProfileFormGroup>({
      name: this.fb.nonNullable.control('', [customRequiredValidator()]),
      lastName: this.fb.nonNullable.control('', [customRequiredValidator()]),
      email: this.fb.nonNullable.control('', [
        customRequiredValidator(),
        customEmailValidator(),
      ]),
      phoneNumber: this.fb.nonNullable.control('', [customRequiredValidator()]),
      money: this.fb.nonNullable.control("885", [customRequiredValidator()])
    });*/


    this.myFormD = this.fb.group<UserProfileFormGroup>({
      name: this.fb.nonNullable.control('adel', [customRequiredValidator()]),
      lastName: this.fb.nonNullable.control('lajil', [customRequiredValidator()]),
      email: this.fb.nonNullable.control('adelajil96@gmail.com', [
        customRequiredValidator(),
        customEmailValidator(),
      ]),
      phoneNumber: this.fb.nonNullable.control('5813975561', [customRequiredValidator()]),
      money: this.fb.nonNullable.control("885", [customRequiredValidator()])
    });
    //this.myFormD.disable()
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
    /*var formValid =
      this.myFormD.invalid &&
      Array.from(this.groupService.obtenirErreur().values());
    console.log(this.groupService.obtenirErreur());
    console.log(this.myFormD.value);
    const erreurApi = [
      { message: 'message', code: 'code', propertyName: 'name' },
    ];
    this.apiError.set(erreurApi);*/
  }
}
