import { DOCUMENT, KeyValuePipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Optional,
  PipeTransform,
  Renderer2,
  Self,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, AbstractControl } from '@angular/forms';

import { DecimalFormatPipe } from '../pipes/decimal-format.pipe';
import { PhoneFormatPipe } from '../pipes/phone-format.pipe';
import { FormValidationErrors } from '../../core/validators/form-validators';

/**
 * Supported input types for the form input component
 */
export type FormInputType = 'text' | 'email' | 'tel' | 'currency' | 'password' | 'number';

/**
 * Text alignment options for form inputs
 */
export type FormInputAlignment = 'start' | 'center' | 'end';

/**
 * Mapping of alignment types to CSS classes
 */
export const INPUT_ALIGNMENTS: Record<FormInputAlignment, string> = {
  start: 'start',
  center: 'center',
  end: 'end'
};

/**
 * Mapping of input types to their corresponding formatting pipes
 */
export const INPUT_PIPES: Partial<Record<FormInputType, any>> = {
  tel: PhoneFormatPipe,
  currency: DecimalFormatPipe
};

/**
 * Flexible form input component that implements ControlValueAccessor for seamless integration
 * with Angular reactive forms. Supports multiple input types, formatting pipes, and
 * validation integration.
 *
 * Features:
 * - Multiple input types (text, email, tel, currency)
 * - Real-time value formatting with pipes
 * - Customizable styling and alignment
 * - Icon support for enhanced UX
 * - Full reactive forms integration
 *
 * @example
 * ```html
 * <app-form-input
 *   label="Email"
 *   type="email"
 *   formControlName="email"
 *   labelFormat="user@example.com"
 *   inputWidth="w-25">
 * </app-form-input>
 * ```
 */
@Component({
  selector: 'app-form-input',
  standalone: true,
  templateUrl: 'form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  imports: [NgClass, FormsModule, KeyValuePipe, DecimalFormatPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent implements ControlValueAccessor, OnChanges, AfterViewInit, OnInit {
  /** The form control value */
  @Input() public value: string | number | null = null;

  /** Label text for the input */
  @Input() public label!: string;

  /** Whether the field is required */
  @Input() public required = true;

  /** Input width CSS class */
  @Input() public inputWidth?: string;
  /** Type of input (text, email, tel, currency) */
  @Input() public type: FormInputType = 'text';

  /** Arguments to pass to the formatting pipe */
  @Input() public pipeArg: unknown | unknown[] = null;

  /** Placeholder text for the input field */
  @Input() public placeholder: string | null = null;

  /** Text alignment within the input field */
  @Input() public alignment: FormInputAlignment | null = null;

  /** Icon to display within the input group */
  @Input() public withIcon: string | null = null;

  /** Format hint to display in the label */
  @Input() public labelFormat: string | null = null;

  /** Reference to the native input element */
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;

  /** Reference to the input group container (when using icons) */
  @ViewChild('inputGroupDiv')
  inputGroupDiv: ElementRef<HTMLInputElement> | null = null;

  /** Signal containing the formatted display value */
  visibleValue = signal<string | number | null>(null);

  /** Whether the input is disabled */
  public disabled = false;

  /** Whether the input is readonly */
  public readonly = false;

  /** Form control reference */
  public formControl: AbstractControl | null = null;

  /** Pipe instance for value formatting */
  private pipe!: PipeTransform;

  /** Callback for value changes */
  private onChangeCallback: (value: string | number | null) => void = () => {};

  /** Callback for touch events */
  private onTouchedCallback: () => void = () => {};

  /** Get the input ID */
  public get id(): string {
    return this.controlDir?.name?.toString() || 'form-input';
  }

  /** Get validation errors */
  public get errors(): FormValidationErrors | null {
    return this.formControl?.touched
      ? (this.formControl.errors as FormValidationErrors)
      : null;
  }

  /** Check if the input has validation errors */
  public hasErrors(): boolean {
    return !!(
      this.formControl?.touched &&
      this.formControl?.errors &&
      Object.keys(this.formControl.errors).length > 0
    );
  }

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Optional() @Self() private controlDir: NgControl,
    public readonly injector: Injector,
    public readonly renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.formControl = this.controlDir?.control || null;
    this.writeValue(this.value);
  }

  ngOnChanges(): void {
    const pipeTransformation = INPUT_PIPES[this.type];
    if (pipeTransformation) this.pipe = this.injector.get(pipeTransformation);
  }

  ngAfterViewInit(): void {
    this.initAlignment();
    this.initWidth();
  }

  public blur(): void {
    this.onTouchedCallback();
  }

  writeValue(value: string | number | null): void {
    this.value = value;
    this.updateVisibleValue(value);
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  onInputChanged(value: string | number | null): void {
    this.updateVisibleValue(value);
    this.onChangeCallback(value);
  }

  updateVisibleValue(value: string | number | null) {
    const formattedValue = this.pipe
      ? this.pipe.transform(value, [this.pipeArg])
      : value;

    this.visibleValue.set(formattedValue);
  }

  private initAlignment() {
    if (this.alignment) {
      this.renderer.addClass(
        this.input.nativeElement,
        `text-${INPUT_ALIGNMENTS[this.alignment]}`
      );
      return;
    }
    let specific;
    if (this.type === 'currency') specific = 'end';
    if (specific)
      this.renderer.addClass(this.input.nativeElement, `text-${specific}`);
  }

  private initWidth() {
    if (this.inputWidth) {
      if (this.withIcon)
        this.inputGroupDiv?.nativeElement.classList.add(this.inputWidth);
      else this.input?.nativeElement.classList.add(this.inputWidth);
    }
  }
}
