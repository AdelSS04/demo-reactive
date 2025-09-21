import { DecimalFormatPipe } from '../../pipes/decimal-format.pipe';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { FormInputType } from './form-input-type';

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
