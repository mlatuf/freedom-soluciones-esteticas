import { Pipe, PipeTransform } from "@angular/core";

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

@Pipe({
  name: "monthName",
})
export class MonthNamePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value === null) return "Not assigned";
    return monthNames[value - 1];
  }
}
