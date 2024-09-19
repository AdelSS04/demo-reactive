import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zipCodeFormat'
})
export class ZipCodeFormatPipe implements PipeTransform {
  transform(value: string, pipeArg: any[]): string {
    if (!value) return value;

    let formattedValue = value.toUpperCase();
    const country = pipeArg[0];
    switch (country.toUpperCase()) {
      case 'CA': // Canada
        formattedValue = formattedValue.replace(/(\w{3})(\w{3})/, '$1 $2');
        break;
      case 'US': // United States
        formattedValue = formattedValue.replace(/(\d{5})(\d{4})?/, '$1-$2');
        break;
      // Add more country-specific formats as needed
      default:
        break;
    }
    return formattedValue;
  }
}
