import { Component, OnInit, Input } from '@angular/core';
import { AppointmentPatient } from '../../../classes/appointment-patient';

@Component({
  selector: 'patient-appointment-history',
  templateUrl: './patient-appointment-history.component.html',
  styleUrls: ['./patient-appointment-history.component.scss']
})
export class PatientAppointmentHistoryComponent implements OnInit {

  @Input() patientId: number;
  appointmentHistory: AppointmentPatient[];

  constructor() { 
    this.appointmentHistory = [];
  }

  ngOnInit() {

    for (let index = 0; index < 5; index++) {
      let appointmentPatient = new AppointmentPatient;
      appointmentPatient.date = new Date();
      appointmentPatient.areas = "todo";
      appointmentPatient.status = "confirmado";
      this.appointmentHistory.push(appointmentPatient);
    }
    for (let index = 0; index < 5; index++) {
      let appointmentPatient = new AppointmentPatient;
      appointmentPatient.date = new Date();
      appointmentPatient.areas = "algo";
      appointmentPatient.status = "cancelado";
      appointmentPatient.observations = "cancelo la rata";
      this.appointmentHistory.push(appointmentPatient);
    }


  }

}
