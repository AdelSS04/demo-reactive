import { FormGroup } from "@angular/forms"

/**
 * Type-safe FormGroup interface that provides strongly-typed access to form controls.
 * Extends the standard Angular FormGroup with type-safe control methods.
 * 
 * @template TControls - Object type defining the structure of form controls
 * 
 * @example
 * ```typescript
 * interface UserFormControls {
 *   email: FormControl<string>;
 *   password: FormControl<string>;
 * }
 * 
 * const form: TypedFormGroup<UserFormControls> = this.fb.group({
 *   email: ['', [Validators.required, Validators.email]],
 *   password: ['', [Validators.required, Validators.minLength(8)]]
 * });
 * ```
 */
export type TypedFormGroup<TControls> = {
  /** Strongly-typed controls object */
  controls: TControls;
  
  /**
   * Registers a control with the form group
   * @param name - The control name (must be a key of TControls)
   * @param control - The form control to register
   */
  registerControl<TName extends keyof TControls>(name: TName, control: TControls[TName]): void;
  
  /**
   * Sets a control on the form group, replacing any existing control
   * @param name - The control name (must be a key of TControls)
   * @param control - The form control to set
   * @param options - Optional configuration for the operation
   */
  setControl<TName extends keyof TControls>(
    name: TName,
    control: TControls[TName],
    options?: Parameters<FormGroup["setControl"]>[2]
  ): void;
  
  /**
   * Removes a control from the form group
   * @param name - The control name to remove (must be a key of TControls)
   * @param options - Optional configuration for the operation
   */
  removeControl<TName extends keyof TControls>(name: TName, options?: Parameters<FormGroup["removeControl"]>[1]): void;
} & Omit<FormGroup, 'controls' | 'registerControl' | 'setControl' | 'removeControl'>;

