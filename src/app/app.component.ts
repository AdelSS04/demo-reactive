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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, skip, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [],
})
export class AppComponent implements OnInit {

  ngOnInit(): void {

  }
  title = 'my-angular-app';
}
