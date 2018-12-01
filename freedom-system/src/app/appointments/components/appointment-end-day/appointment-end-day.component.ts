import { Component, Input, OnChanges } from '@angular/core';
import { Appointment } from '../../classes/appointment';

@Component({
  selector: 'appointment-end-day',
  templateUrl: './appointment-end-day.component.html',
  styleUrls: ['./appointment-end-day.component.scss']
})
export class AppointmentEndDayComponent implements OnChanges {

  @Input() endedAppointments: Appointment[];
  takings: any;

  constructor() { 
    this.takings = {
      'cash': 0,
      'debit': 0,
      'credit': 0,
      'total': 0
    }
  }

  ngOnChanges(): void {
    this.endedAppointments.forEach((appointment) => {
      switch (appointment.paymentMethod) {
        case 1:
          this.takings.cash += appointment.price; 
        break;
        case 2:
          this.takings.debit += appointment.price; 
        break;
        case 3:
          this.takings.credit += appointment.price; 
        break;
        default:
          this.takings.cash += appointment.price; 
        break;
      }
      this.takings.total = this.takings.cash + this.takings.debit + this.takings.credit;
    });
  }
}
