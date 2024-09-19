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
import { EvcVidationErrors } from './helprs';

@Component({
  template: '',
})
export abstract class EvcInputCvaBaseComponent<T>
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
  @Input() public disabled = true;
  // when directive formControl is used instead of formControlName
  @Input() public identifiant?: string;
  @Input() public inputWidth?: string;

  public requiredLabel: string = this.required
    ? `( required )`
    : `( not required )`;

  public get id(): string {
    const id =
      this.identifiant ??
      this.controlDir.name?.toString() ??
      new Error('identifiant or formControlName is required');
    if (id instanceof Error) throw id;
    return id;
  }



  protected formControl!: AbstractControl | null;
  private onChangeCallBack!: (value: T) => unknown;
  private onTouchedCallBack!: () => void;
  private _readOnly = false;
  private _touched = false;
  private _errorsPresent = false;

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Optional() @Self() private controlDir: NgControl,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    controlDir.valueAccessor = this;
  }

  public ngOnInit(): void {
    this.formControl = this.controlDir.control;
  }

  ngDoCheck(): void {
    if (this._touched !== this.formControl!.touched) {
      this._touched = this.formControl!.touched;
      this.changeDetectorRef.markForCheck();
    }
    const newErrorPresent = this.hasErrors();
    if (newErrorPresent !== this._errorsPresent) {
      this._errorsPresent = newErrorPresent;
      this.changeDetectorRef.markForCheck();
    }
  }

  public onTouched() {
    this.onTouchedCallBack();
  }

  onChanged(value: T) {
    if (this.onChangeCallBack) {
      this.onChangeCallBack(value);
    }
  }

  public get errors(): EvcVidationErrors | null {
    return this.formControl?.touched
    ? (this.formControl.errors as EvcVidationErrors)
    : null;
  }

  public hasErrors(): boolean {
    return (
      this.formControl!.touched! &&
      this.formControl!.errors! &&
      Object.keys(this.formControl!.errors).length > 0
    );
  }

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChangeCallBack = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallBack = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (this.disabled !== isDisabled) {
      this.disabled = isDisabled;
      this.changeDetectorRef.markForCheck();
    }
  }
}
