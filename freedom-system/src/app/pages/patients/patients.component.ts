import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Patient } from '../../classes/patient';
import { PatientService } from '../../shared/patient.service';
import { AlertService } from '../../shared/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  pageTitle: string;
  patients: Patient[];
  openHistory: Boolean;
  openConfirmation: Boolean;
  patientSelected: number;
  patientNameSelected: string;
  mobileView: boolean;

  constructor(route: ActivatedRoute, private patientService: PatientService, 
      private spinner:   NgxSpinnerService, private alertService: AlertService) {
    this.pageTitle = route.snapshot.data['title'];
    this.openHistory = this.openConfirmation = false;
    this.mobileView = (window.screen.width < 576);
  }

  ngOnInit() {
    this.patients = [];
    this.getPatientList();
  }
  
  
  private getPatientList() {    
    this.spinner.show();
    this.patientService.getPatients$().subscribe(
      response => {
        this.patients = response;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  showHistoryModal(patientId: number) {
    this.patientSelected = patientId;
    this.openHistory = true;
  }

  deletePatient(patientId: number, patientName: string) {
    this.patientSelected = patientId;
    this.patientNameSelected = patientName;
    this.openConfirmation = true;
  }

  confirmDeletePatient() {
    this.openConfirmation = false;
    this.spinner.show();    
    this.patientService.deletePatient$(this.patientSelected).subscribe(
      response => {
        this.spinner.hide();
        this.alertService.success(response);
        this.getPatientList();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }
} 
