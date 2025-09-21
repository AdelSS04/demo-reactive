import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

/**
 * Pipe for formatting phone numbers based on country code
 * Supports French and Canadian phone number formats
 */
@Pipe({
  name: 'phoneFormat',
  pure: false,
  standalone: true,
})
export class PhoneFormatPipe implements PipeTransform {
  /**
   * Formats a phone number string based on country code
   * @param value - The phone number string to format
   * @param pipeArg - Array containing country code as first element
   * @returns Formatted phone number string
   */
  transform(value: string | null, pipeArg: any[]): string {
    if (!value) {
      return '';
    }

    const country = pipeArg[0] ?? 'CA';
    const cleaned = (`${value}`).replace(/\D/g, ''); // Remove non-digit characters

    if (country === 'FR') {
      const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
      if (match) {
        return `+33 ${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
      }
    } else if (country === 'CA') {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }

    return cleaned;
  }
}
