import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateCo', standalone: true })
export class DateCoPipe implements PipeTransform {
  transform(value: string | Date): string {
    return new Intl.DateTimeFormat('es-CO').format(new Date(value));
  }
}
