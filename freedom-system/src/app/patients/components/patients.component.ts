import { Component, OnInit } from '@angular/core';

import { Patient } from '../classes/patient';
import { PatientService } from '../services/patient.service';
import { AlertService } from '../../core/services/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationStateService } from '../../core/services/aplication-state/aplication-state.service';


@Component({
  selector: 'patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  mobileView: Boolean;
  patients: Patient[];
  openHistory: Boolean;
  openConfirmation: Boolean;
  patientSelected: number;
  patientNameSelected: string;

  constructor(private aplicationStateService: ApplicationStateService, 
    private patientService: PatientService, 
    private spinner:   NgxSpinnerService, private alertService: AlertService) {
    this.openHistory = this.openConfirmation = false;
  }
  
  ngOnInit() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
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
        this.alertService.success("Paciente eliminado con exito");
        this.getPatientList();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }
} 
