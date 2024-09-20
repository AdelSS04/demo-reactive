import { PipeTransform, Type } from '@angular/core';
import { EvcError } from '../../form-group/evc-erreur';
import { EvcTypeInput } from './evc-type-input';
import { DecimalPipe } from '@angular/common';
import { ZipCodeFormatPipe } from '../../pipes/zipCodeFormatPipe.pipe';
import { DecimalFormatPipe } from '../../pipes/decimalFormatPipe.pipe';
import { PhoneFormatPipe } from '../../pipes/phoneFormat.pipe';

export type EvcAlignementInput = 'right' | 'left'

export const pipes : {[key in EvcTypeInput] : Type<PipeTransform> | null} = {
  number : DecimalFormatPipe,
  zipCode : ZipCodeFormatPipe,
  montant : DecimalFormatPipe,
  email : null,
  tel : PhoneFormatPipe,
  url : null,
  text : null,
}

export const alignement : {[key in EvcAlignementInput] : string | null}={
  right:'end',
  left:'start'
}
