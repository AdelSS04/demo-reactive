import {
  computed,
  DestroyRef,
  EventEmitter,
  Injectable,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { EvcError, EvcErrorsAvecCle } from '../evc-erreur';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IActionFormControl, ObtenirErreur } from './helpers/obtenir-erreur';

@Injectable()
export class EvcFormGroupService {
  public get formGroup(): FormGroup {
    return this.formGroupRef;
  }
  public erreursunitaire = computed(() => this._erreursUnitaire());
  public get formGroupReinitialise$(): Observable<void> {
    return this._formGroupReinitialise$.asObservable();
  }
  public get formGroupSoumis$(): Observable<void> {
    return this._formGroupSoumis$.asObservable();
  }
  public get sauvegardeChargee$(): Observable<Record<string, any>> {
    return this._sauvegardeChargee$.asObservable();
  }
  private _erreursUnitaire = signal(new Map<string, EvcError>());
  private _formGroupReinitialise$: Subject<void>;
  private _formGroupSoumis$: Subject<void>;
  private _sauvegardeChargee$: Subject<Record<string, any>>;

  private formGroupRef!: FormGroup;
  private ngsubmitsubscription?: Subscription;

  private toucherControls: IActionFormControl = {
    action: (key: string, control: AbstractControl) => {
      control.markAsTouched();
    },
  };
  constructor(destroyRef: DestroyRef) {
    this._formGroupReinitialise$ = new Subject<void>();
    this._formGroupSoumis$ = new Subject<void>();
    this._sauvegardeChargee$ = new Subject<Record<string, any>>();
    destroyRef.onDestroy(() => this.ngsubmitsubscription?.unsubscribe());
  }

  public bind(
    formGroup: FormGroup,
    formGroupDirective: FormGroupDirective,
    destroyRef?: DestroyRef | Observable<void>
  ): void {
    this.formGroupRef = formGroup;
    let ngSubmit$: EventEmitter<any> | Observable<any>;
    if (destroyRef === undefined) ngSubmit$ = formGroupDirective.ngSubmit;
    else if (destroyRef instanceof Observable)
      ngSubmit$ = formGroupDirective.ngSubmit.pipe(takeUntil(destroyRef));
    else
      ngSubmit$ = formGroupDirective.ngSubmit.pipe(
        takeUntilDestroyed(destroyRef)
      );

    this.ngsubmitsubscription = ngSubmit$.subscribe(() => this.soumettre());
    this._erreursUnitaire.set(new Map<string, EvcError>());
  }

  public obtenirErreur() : Map<string, EvcErrorsAvecCle>{
    const obtenir : ObtenirErreur =
    new ObtenirErreur(new Map<string, EvcErrorsAvecCle>(),false);
    this.traverseFormGroup(
      '',
      this.formGroupRef,
      false,
      obtenir
    );
    this._erreursUnitaire.set(obtenir.erreurs);
    return obtenir.erreurs
  }
  private soumettre(){
    this.toucherEtMettreAJourErreursUnitaires();
    this._formGroupSoumis$.next();
  }
  private toucherEtMettreAJourErreursUnitaires(): void {
    const obtenirErreurs: ObtenirErreur =
      new ObtenirErreur(new Map<string, EvcErrorsAvecCle>());
    this.traverseFormGroup(
      '',
      this.formGroupRef,
      false,
      this.toucherControls,
      obtenirErreurs
    );
    this._erreursUnitaire.set(obtenirErreurs.erreurs);
  }

  private traverseFormGroup(
    key: string,
    control: AbstractControl,
    estDansFormArray: boolean,
    ...actionsFormControl: IActionFormControl[]
  ): AbstractControl | null {
    if (control instanceof FormControl) {
      for (const actionFormControl of actionsFormControl) {
        actionFormControl.action(key, control);
      }
      return control;
    }
    if (control instanceof FormGroup) {
      for (const actionFormControl of actionsFormControl)
        actionFormControl.action(key, control);
      Object.keys(control.controls).forEach((keyControl) => {
        const controlname = estDansFormArray
          ? keyControl
          : `${key}-${keyControl}`;
        this.traverseFormGroup(
          controlname,
          control.controls[keyControl],
          estDansFormArray,
          ...actionsFormControl
        );
      });
    }
    if (control instanceof FormArray) {
      for (const actionFormControl of actionsFormControl)
        actionFormControl.action(key, control);
      for (const [index, value] of control.controls.entries())
        this.traverseFormGroup(
          `${key}-${index + 1}`,
          value,
          true,
          ...actionsFormControl
        );
    }
    return null;
  }
}
