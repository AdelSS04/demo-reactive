import { FormGroup } from "@angular/forms"

export type FormGroupWithControls<TControls> = {
  controls: TControls;
  registerControl<TName extends keyof TControls>(name: TName, control: TControls[TName]): void;
  setControl<TName extends keyof TControls>(
    name: TName,
    control: TControls[TName],
    options?: Parameters<FormGroup["setControl"]>[2]
  ): void;
  removeControl<TName extends keyof TControls>(name: TName, options?: Parameters<FormGroup["removeControl"]>[1]): void;
} & Omit<FormGroup, 'controls' | 'registerControl' | 'setControl' | 'removeControl'>;

