import { Pipe, PipeTransform } from '@angular/core';

const statusDescriptions = ["Nuevo", "Esperando confirmacion", "Confirmado", "Ausente", "Presente", "Finalizado", "Cancelado"];

@Pipe({
  name: 'statusDescription'
})
export class StatusDescriptionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null) return 'Not assigned';
    return statusDescriptions [value - 1];
  }

}
