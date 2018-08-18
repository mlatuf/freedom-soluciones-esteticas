import { Component, OnInit, Input } from '@angular/core';

import { AppointmentPatient } from '../../../classes/appointment-patient';
import { PatientService } from '../../../shared/patient.service';

@Component({
  selector: 'patient-appointment-history',
  templateUrl: './patient-appointment-history.component.html',
  styleUrls: ['./patient-appointment-history.component.scss']
})
export class PatientAppointmentHistoryComponent implements OnInit {

  @Input() patientId: number;
  appointmentHistory: AppointmentPatient[];

  constructor(private patientService: PatientService) { 
    this.appointmentHistory = [];
  }

  ngOnInit() {
    this.patientService.getAppoinmentsPatientData$(this.patientId).subscribe(
      response => {
        this.appointmentHistory = response;
      },
      error => {
        console.log(error);
      }
    );
  }

}
