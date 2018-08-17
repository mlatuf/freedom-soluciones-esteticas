import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Patient } from '../../../classes/patient';
import { PatientService } from '../../../shared/patient.service';

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

  constructor(private route: ActivatedRoute, private patientService: PatientService) {
    this.pageTitle = this.route.snapshot.data['title'];
    this.patientId = +this.route.snapshot.paramMap.get('id');
  }
  
  ngOnInit() {
    this.patient = new Patient;
    this.editionMode = (this.patientId === 0);
    if (this.patientId) {
      // this.patientService.getPatientData$(this.patientId).subscribe(
      this.patientService.getPatientData$(1).subscribe(
        response => {
          this.patient = response;
        },
        error => {
          console.log(error);
        }
      );
    } 
  }

}
