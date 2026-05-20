import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoMoneda',
  standalone: true
})
export class FormatoMonedaPipe implements PipeTransform {
  transform(value: number | string | null | undefined, compact = true): string {
    if (value == null || isNaN(Number(value))) return '$0';
    const num = Number(value);

    if (compact) {
      const abs = Math.abs(num);
      const sign = num < 0 ? '-' : '';
      if (abs >= 1_000_000_000) {
        return `${sign}$${(abs / 1_000_000_000).toFixed(1).replace('.', ',')}B`;
      }
      if (abs >= 1_000_000) {
        return `${sign}$${(abs / 1_000_000).toFixed(0)}M`;
      }
      if (abs >= 1_000) {
        return `${sign}$${(abs / 1_000).toFixed(0)}K`;
      }
      return `${sign}$${abs}`;
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }
}
