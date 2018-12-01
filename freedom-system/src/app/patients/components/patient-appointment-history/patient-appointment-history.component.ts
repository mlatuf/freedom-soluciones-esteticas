import { Component, OnInit, Input } from '@angular/core';

import { AppointmentPatient } from '../../../patients/classes/appointment-patient';
import { PatientService } from '../../../patients/services/patient.service';
import { AlertService } from '../../../core/services/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'patient-appointment-history',
  templateUrl: './patient-appointment-history.component.html',
  styleUrls: ['./patient-appointment-history.component.scss']
})
export class PatientAppointmentHistoryComponent implements OnInit {

  @Input() patientId: number;
  appointmentHistory: AppointmentPatient[];

  constructor(private patientService: PatientService, private spinner: NgxSpinnerService, private alertService: AlertService ) { 
    this.appointmentHistory = [];
  }

  ngOnInit() {
    this.spinner.show();
    this.patientService.getAppoinmentsPatientData$(this.patientId).subscribe(
      response => {
        this.appointmentHistory = response;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

}
