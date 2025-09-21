import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe for formatting decimal numbers with specified decimal places
 * Supports European number formatting with comma as decimal separator
 */
@Pipe({
  name: 'decimalFormat',
  standalone: true
})
export class DecimalFormatPipe implements PipeTransform {
  /**
   * Transforms a number into a formatted decimal string
   * @param value - The number to format
   * @param pipeArg - Array containing decimal places as first element
   * @returns Formatted decimal string
   */
  transform(value: number | string | null, pipeArg: any[]): string {
    if (value == null) return '';
    const decimalPlaces = pipeArg[0] || 2;
    let valueStr = value.toString();

    if (!valueStr) return "";

    if (valueStr.includes(',') || valueStr.includes('.')) {
      valueStr = valueStr.replace(/\./g, ',');
      const [integerPart, decimalPartValue = ''] = valueStr.split(',');
      const formattedDecimalPart = decimalPartValue.padEnd(decimalPlaces, '0').substring(0, decimalPlaces);
      return `${integerPart},${formattedDecimalPart}`;
    }

    const formattedIntegerPart = valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedIntegerPart},${'0'.repeat(decimalPlaces)}`;
  }
}
