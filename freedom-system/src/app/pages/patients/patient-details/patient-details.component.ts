import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Patient } from '../../../classes/patient/patient';
import { PatientService } from '../../../shared/patient/patient.service';
import { AlertService } from '../../../shared/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationStateService } from 'src/app/shared/aplication-state/aplication-state.service';

@Component({
  selector: 'patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {

  mobileView: Boolean;
  patient: Patient;
  patientId: number;
  @Input() editionMode: Boolean;
  openConfirmation: Boolean;

  constructor(private route: ActivatedRoute,
    private aplicationStateService: ApplicationStateService,
    private router: Router, 
    private patientService: PatientService, private spinner: NgxSpinnerService, 
    private alertService: AlertService) {
      this.openConfirmation = false;
  }
    
  ngOnInit() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
    this.patientId = +this.route.snapshot.paramMap.get('id');
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

  cancelEdition(formDirty) {
    this.openConfirmation = formDirty;
    if (!formDirty) {
      this.router.navigate(['/patients']);
    }
  }
  
  confirmCancelation() {
    this.router.navigate(['/patients']);
  }

}
