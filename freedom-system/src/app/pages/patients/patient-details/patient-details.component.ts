import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Patient } from '../../../classes/patient';

@Component({
  selector: 'patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {

  patient: Patient;
  pageTitle: string;

  constructor(route: ActivatedRoute) {
    this.pageTitle = route.snapshot.data['title'];
  }
  
  ngOnInit() {
    this.patient = new Patient;
  }

}
