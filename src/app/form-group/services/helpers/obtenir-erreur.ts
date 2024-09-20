import { AbstractControl, ValidationErrors } from '@angular/forms';
import { EvcError, EvcErrorsAvecCle } from '../../evc-erreur';

export class ObtenirErreur implements IActionFormControl {
  constructor(
    public erreurs: Map<string, EvcErrorsAvecCle>,
    public champsToucheeSeulement = true
  ) {}


  public action(key: string, control: AbstractControl): void {
    if (this.champsToucheeSeulement && control.untouched) return;
    const controlErrors: ValidationErrors | null = control.errors;
    if (controlErrors != null) {
      Object.entries(controlErrors).forEach(
        ([cleErreur, erreur]: [string, EvcError]) => {
          console.warn("here info")
          console.log(cleErreur,erreur)
          this.erreurs.set(key, {
            cleErreur,
            message: erreur.message,
          });
        }
      );
    }
  }
}

export interface IActionFormControl {
    action(key: string, control: AbstractControl): void;
  }




