import { DOCUMENT, KeyValuePipe, NgClass } from '@angular/common';
import {
  AfterViewChecked,
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
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';

import { FormInputType } from '../shared/types/form-input-type';
import { INPUT_ALIGNMENTS, FormInputAlignment, INPUT_PIPES } from '../shared/constants/form-input-constants';
import { DecimalFormatPipe } from '../pipes/decimalFormatPipe.pipe';
import { FormInputBaseComponent } from '../shared/components/form-input-base.component';

/**
 * Flexible input component that implements ControlValueAccessor for seamless integration
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
 * <form-input
 *   label="Email"
 *   type="email"
 *   formControlName="email"
 *   labelFormat="user@example.com"
 *   inputWidth="w-25">
 * </form-input>
 * ```
 */
@Component({
  standalone: true,
  selector: 'form-input',
  templateUrl: 'input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [FormsModule, KeyValuePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent
  extends FormInputBaseComponent<string | number | null>
  implements ControlValueAccessor, OnChanges, AfterViewInit, OnInit
{
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

  /** Pipe instance for value formatting */
  private pipe!: PipeTransform;

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Optional() @Self() controlDir: NgControl,
    public readonly injector: Injector,
    public readonly render: Renderer2,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(document, controlDir, changeDetectorRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.writeValue(this.value);
  }
  ngOnChanges(): void {
    const pipeTransformation = INPUT_PIPES[this.type];
    if (pipeTransformation) this.pipe = this.injector.get(pipeTransformation);
  }
  ngAfterViewInit(): void {
    this.initAligne();
    this.initWidth();
  }
  public blur(): void {
    this.onTouched();
  }
  override writeValue(value: string | number | null): void {
    this.updateVisibleValue(value);
    super.writeValue(value);
    // null si unchanged ??
  }
  onInputChanged(value: string | number | null): void {
    this.updateVisibleValue(value);
    this.onChanged(value);
  }

  updateVisibleValue(value: string | number | null) {
    const fromatedValue = this.pipe
      ? this.pipe.transform(value, [this.pipeArg])
      : value;

    this.visibleValue.set(fromatedValue);
  }
  private initAligne() {
    if (this.alignment) {
      this.render.addClass(
        this.input.nativeElement,
        `text-${INPUT_ALIGNMENTS[this.alignment]}`
      );
      return;
    }
    let specific;
    if (this.type === 'currency') specific = 'end';
    if (specific)
      this.render.addClass(this.input.nativeElement, `text-${specific}`);
  }
  private initWidth() {
    if (this.inputWidth) {
      if (this.withIcon)
        this.inputGroupDiv?.nativeElement.classList.add(this.inputWidth);
      else this.input?.nativeElement.classList.add(this.inputWidth);
    }
  }

  /**
   * Helper method to extract error message safely from validation errors
   * @param errorValue - The error value from Angular's validation errors
   * @returns The error message string
   */
  getErrorMessage(errorValue: any): string {
    return errorValue?.message || 'Validation error';
  }
}
