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

import { EvcTypeInput } from './helpers/evc-type-input';
import { alignement, EvcAlignementInput, pipes } from './helpers/evc-input-const';
import { DecimalFormatPipe } from '../pipes/decimalFormatPipe.pipe';
import { EvcInputCvaBaseComponent } from './base/evc-input-cva-base.component';

@Component({
  standalone: true,
  selector: 'evc-input',
  templateUrl: 'input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [NgClass, FormsModule, KeyValuePipe, DecimalFormatPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent
  extends EvcInputCvaBaseComponent<string | number | null>
  implements ControlValueAccessor, OnChanges, AfterViewInit, OnInit
{
  @Input() public type: EvcTypeInput = 'text';
  @Input() public pipeArg: unknown | unknown[] = null;
  @Input() public placeholder: string | null = null;
  @Input() public alignement: EvcAlignementInput | null = null;
  @Input() public withIcon: string | null = null;
  @Input() public labelFormat: string | null = null;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('inputGroupDiv')
  inputGroupDiv: ElementRef<HTMLInputElement> | null = null;

  visibleValue = signal<string | number | null>(null);
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
    const pipeTransformation = pipes[this.type];
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
    if (this.alignement) {
      this.render.addClass(
        this.input.nativeElement,
        `text-${alignement[this.alignement]}`
      );
      return;
    }
    let specific;
    if (this.type === 'montant') specific = 'end';
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
}
