import { PipeTransform, Type } from '@angular/core';
import { DecimalFormatPipe } from '../pipes/decimal-format.pipe';
import { PhoneFormatPipe } from '../pipes/phone-format.pipe';
import { ZipCodeFormatPipe } from '../pipes/zip-code-format.pipe';
import { FormInputType } from '../types/form-input-type';

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
export const INPUT_PIPES: Partial<Record<FormInputType, Type<PipeTransform> | null>> = {
  tel: PhoneFormatPipe,
  currency: DecimalFormatPipe,
  number: DecimalFormatPipe,
  email: null,
  url: null,
  text: null,
  password: null
};
