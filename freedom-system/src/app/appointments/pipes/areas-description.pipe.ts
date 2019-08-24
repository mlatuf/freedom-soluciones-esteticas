import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'areasDescription'
})
export class AreasDescriptionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null) return 'Not assigned';
    return value.map((val) => (val.description)).reduce((txt, next) => txt + " - "+ next);
  }

}
