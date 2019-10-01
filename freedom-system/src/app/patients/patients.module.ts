import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { PatientsComponent } from './components/patients.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { PatientAppointmentHistoryComponent } from './components/patient-appointment-history/patient-appointment-history.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    ClarityModule,
    RouterModule
  ],
  declarations: [
    PatientsComponent,
    PatientDetailsComponent,
    PatientAppointmentHistoryComponent
  ]
})
export class PatientsModule { }
