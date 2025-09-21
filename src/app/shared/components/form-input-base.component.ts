import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  Inject,
  Input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';
import { FormValidationErrors } from '../../core/validators/form-validators';

/**
 * Abstract base component for custom form input controls
 * Implements ControlValueAccessor pattern for seamless Angular forms integration
 */
@Component({
  template: '',
})
export abstract class FormInputBaseComponent<T>
  implements ControlValueAccessor, OnInit, DoCheck
{
  @Input() public value!: T;
  @Input() public label!: string;
  @Input() public set readonly(readonlyValue: boolean | '') {
    this._readOnly = readonlyValue === '' || readonlyValue;
  }
  public get readonly(): boolean {
    return this._readOnly;
  }
  @Input() public required = true;
  @Input() public identifier?: string;
  @Input() public inputWidth?: string;
  public disabled = false;

  public get requiredLabel(): string {
    return this.required ? `(required)` : `(optional)`;
  }

  public get id(): string {
    const id =
      this.identifier ??
      this.controlDir?.name?.toString() ??
      'form-input';
    return id;
  }

  protected formControl!: AbstractControl | null;
  private onChangeCallback!: (value: T) => unknown;
  private onTouchedCallback!: () => void;
  private _readOnly = false;
  private _touched = false;
  private _errorsPresent = false;

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    @Optional() @Self() protected controlDir: NgControl,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    this.formControl = this.controlDir?.control || null;
  }

  ngDoCheck(): void {
    if (this.formControl) {
      if (this._touched !== this.formControl.touched) {
        this._touched = this.formControl.touched;
        this.changeDetectorRef.markForCheck();
      }
      const newErrorPresent = this.hasErrors();
      if (newErrorPresent !== this._errorsPresent) {
        this._errorsPresent = newErrorPresent;
        this.changeDetectorRef.markForCheck();
      }
    }
  }

  public onTouched() {
    if (this.onTouchedCallback) {
      this.onTouchedCallback();
    }
  }

  onChanged(value: T) {
    if (this.onChangeCallback) {
      this.onChangeCallback(value);
    }
  }

  public get errors(): FormValidationErrors | null {
    return this.formControl?.touched
      ? (this.formControl.errors as FormValidationErrors)
      : null;
  }

  public hasErrors(): boolean {
    return !!(
      this.formControl?.touched &&
      this.formControl?.errors &&
      Object.keys(this.formControl.errors).length > 0
    );
  }

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (this.disabled !== isDisabled) {
      this.disabled = isDisabled;
      this.changeDetectorRef.markForCheck();
    }
  }
}
