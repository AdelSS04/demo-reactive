import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe for formatting postal/zip codes based on country format
 * Supports Canadian and US postal code formats
 */
@Pipe({
  name: 'zipCodeFormat',
  standalone: true
})
export class ZipCodeFormatPipe implements PipeTransform {
  /**
   * Formats a postal/zip code based on country format
   * @param value - The postal code string to format
   * @param pipeArg - Array containing country code as first element
   * @returns Formatted postal code string
   */
  transform(value: string | null, pipeArg: any[]): string {
    if (!value) return value || '';

    let formattedValue = value.toUpperCase();
    const country = pipeArg[0];

    switch (country?.toUpperCase()) {
      case 'CA': // Canada - A1A 1A1 format
        formattedValue = formattedValue.replace(/(\w{3})(\w{3})/, '$1 $2');
        break;
      case 'US': // United States - 12345-6789 format
        formattedValue = formattedValue.replace(/(\d{5})(\d{4})?/, '$1-$2');
        break;
      default:
        break;
    }
    return formattedValue;
  }
}
