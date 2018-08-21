import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RoutingModule } from './routing.module';
import { ClarityModule,ClrFormsNextModule } from '@clr/angular';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { MenuComponent } from './common/menu/menu.component';
import { AlertsComponent } from './common/alerts/alerts.component';

import { AppointmentsComponent } from './pages/appointments/appointments.component';

import { PatientsComponent } from './pages/patients/patients.component';
import { PatientDetailsComponent } from './pages/patients/patient-details/patient-details.component';
import { PatientAppointmentHistoryComponent } from './pages/patients/patient-appointment-history/patient-appointment-history.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AlertsComponent,
    AppointmentsComponent,
    PatientsComponent,
    PatientDetailsComponent,
    PatientAppointmentHistoryComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    RoutingModule,
    ClarityModule,
    ClrFormsNextModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
