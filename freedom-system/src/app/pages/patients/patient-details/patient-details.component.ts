import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Patient } from '../../../classes/patient';
import { PatientService } from '../../../shared/patient.service';
import { AlertService } from '../../../shared/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {

  patient: Patient;
  pageTitle: string;
  patientId: number;
  @Input() editionMode: Boolean;

  constructor(private route: ActivatedRoute, private router: Router, 
    private patientService: PatientService, private spinner: NgxSpinnerService, 
    private alertService: AlertService) {
    this.pageTitle = this.route.snapshot.data['title'];
    this.patientId = +this.route.snapshot.paramMap.get('id');
  }
  
  ngOnInit() {
    this.patient = new Patient;
    this.editionMode = (this.patientId === 0);
    if (this.patientId) {
      this.spinner.show();
      this.patientService.getPatientData$(this.patientId).subscribe(
        response => {
          this.patient = response;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );
    } 
  }

  onSubmit() {
    this.spinner.show();
    this.patientService.savePatient$(this.patient).subscribe(
      response => {
        this.patient = response;
        this.spinner.hide();
        this.router.navigate(['/patients']);
        this.alertService.success("Paciente creado con exito");
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

}
