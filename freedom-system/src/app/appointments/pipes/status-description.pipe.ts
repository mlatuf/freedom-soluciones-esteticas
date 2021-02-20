import { Pipe, PipeTransform } from '@angular/core';
import { getStatusByKey } from '../constants/status.enum';

@Pipe({
  name: 'statusDescription'
})
export class StatusDescriptionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null) return 'Not assigned';
    return getStatusByKey(value).label;
  }

}
