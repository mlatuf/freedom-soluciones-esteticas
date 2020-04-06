import { Component, Inject, OnChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Appointment } from '../../classes/appointment';

export interface ModalData {
  title: string;
  appointments: Appointment[]; 
}

export interface Transaction {
  item: string;
  cost: number;
}
@Component({
  selector: 'appointment-end-day',
  templateUrl: './appointment-end-day.component.html',
  styleUrls: ['./appointment-end-day.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AppointmentEndDayComponent implements OnChanges {
  displayedColumns: string[] = ['item', 'cost'];
  takings: Transaction[] = [
    {item: 'Efectivo', cost: 0},
    {item: 'Debito', cost: 0},
    {item: 'Credito' ,cost: 0},
    {item: 'Mercado pago', cost: 0},
  ];

  constructor(public dialogRef: MatDialogRef<AppointmentEndDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData) {}

  getTotalCost() {
    return this.takings.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  ngOnChanges(): void {
    this.data.appointments.forEach((appointment) => {
      switch (appointment.paymentMethod) {
        case 1:
          this.takings[0].cost += appointment.price; 
        break;
        case 2:
          this.takings[1].cost += appointment.price; 
        break;
        case 3:
          this.takings[2].cost += appointment.price; 
        break;
        case 4:
          this.takings[3].cost += appointment.price; 
        break;
        default:
          this.takings[0].cost += appointment.price; 
        break;
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

