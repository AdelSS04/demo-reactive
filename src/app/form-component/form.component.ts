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
import { ApiFormError } from '../form-group/form-error-types';
import { InputComponent } from '../input/input.component';
import { ErrorListComponent } from '../component/error-list.component';
import { NgClass, JsonPipe } from '@angular/common';
import { UserProfileFormGroup, UserProfileModel } from '../formGroup/userProfile-form-group';
import { DecimalFormatPipe } from '../shared/pipes/decimal-format.pipe';
import { PhoneFormatPipe } from '../shared/pipes/phone-format.pipe';
import { FormGroupService } from '../core/services/form-group.service';
import { FormValidators } from '../core/validators/form-validators';
import { AdressComponent } from '../component/adress/adress.component';
import { ZipCodeFormatPipe } from '../shared/pipes/zip-code-format.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, skip, startWith } from 'rxjs';
import { FormWithUnsavedChanges, FORM_COMPONENT_TOKEN } from '../guards/unsaved-changes.guard';
import { UnsavedChangesDirective } from '../directive/unsaved-changes.directive';

@Component({
  selector: 'app-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    ErrorListComponent,
    NgClass,
    JsonPipe,
    AdressComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [FormGroupService,DecimalFormatPipe,PhoneFormatPipe,ZipCodeFormatPipe, { provide: FORM_COMPONENT_TOKEN, useExisting:forwardRef(()=> AppFormComponent)  }],
  hostDirectives:[UnsavedChangesDirective]
})
export class AppFormComponent implements OnInit,FormWithUnsavedChanges {
  groupService = inject(FormGroupService);
  destoryRef = inject(DestroyRef);
  apiError = signal<ApiFormError[]>([]);
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
      name: this.fb.nonNullable.control(this.model.name ?? "", [FormValidators.required()]),
      lastName: this.fb.nonNullable.control(this.model.lastName ?? "", [FormValidators.required()]),
      email: this.fb.nonNullable.control(this.model.email ?? "", [
        FormValidators.required(),
        FormValidators.email(),
      ]),
      phoneNumber: this.fb.nonNullable.control(this.model.phoneNumber ?? "", [FormValidators.required()]),
      money: this.fb.nonNullable.control(this.model.money ?? "", [FormValidators.required()])
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

  /**
   * Toggles the form's enabled/disabled state for demonstration purposes
   */
  disable(){
    if (this.form.disabled) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  /**
   * Resets the form to its initial state with default values
   */
  resetForm() {
    this.form.reset();
    this.form.patchValue(this.model);
    this.apiError.set([]);
  }

  /**
   * Returns the current form value for display purposes
   */
  getFormValue() {
    return this.form.value;
  }

  /**
   * Handles form submission with validation and error simulation
   */
  submit() {
    console.log('Form pristine:', this.form.pristine);
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', structuredClone(this.form.value));

    if (this.form.invalid) {
      const errors = Array.from(this.groupService.getFormErrors().values());
      console.info('Form submission failed - validation errors:', errors);
      return;
    }

    // Simulate API error for demonstration
    if (this.form.value.email === 'error@test.com') {
      const erreurApi = [
        { message: 'Email already exists in system', code: 'EMAIL_EXISTS', propertyName: 'email' },
      ];
      this.apiError.set(erreurApi);
      return;
    }

    // Clear any previous API errors
    this.apiError.set([]);

    // Simulate successful submission
    alert('Form submitted successfully! ✅\n\nCheck the console for form data.');
  }
}
