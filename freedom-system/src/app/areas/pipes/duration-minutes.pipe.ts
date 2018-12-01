import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationMinutes'
})
export class DurationMinutesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null) return 'Not assigned';
    return value*15 + ' min';
  }

}
