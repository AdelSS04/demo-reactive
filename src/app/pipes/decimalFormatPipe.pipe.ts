import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormat',
  standalone: true
})
export class DecimalFormatPipe implements PipeTransform {
  transform(value: number, pipeArg: any[]): string {
    if (value == null) return '';
    const decimalPart = pipeArg[0];
    let valueStr = value.toString();

    if(!valueStr)
      return "";
    if (valueStr.includes(',') || valueStr.includes('.')) {
      valueStr = valueStr.replace(/\./g, ',');
      const [integerPart, decimalPartValue = ''] = valueStr.split(',');
      const formattedDecimalPart = decimalPartValue.padEnd(decimalPart, '0').substring(0, decimalPart);
      return `${integerPart},${formattedDecimalPart}`;
    }

    const formattedIntegerPart = valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedIntegerPart},${'0'.repeat(decimalPart)}`;
  }
}



