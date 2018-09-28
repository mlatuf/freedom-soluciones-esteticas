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
import { MonthNamePipe } from './common/pipes/month-name.pipe';
import { DurationMinutesPipe } from './common/pipes/duration-minutes.pipe';
import { TimeMinutesPipe } from './common/pipes/time-minutes.pipe';
import { StatusDescriptionPipe } from './common/pipes/status-description.pipe';
import { AreasDescriptionPipe } from './common/pipes/areas-description.pipe';

import { CalendarComponent } from './pages/calendar/calendar.component';

import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { AppointmentActionsComponent } from './pages/appointments/appointment-actions/appointment-actions.component';
import { AppointmentEndDayComponent } from './pages/appointments/appointment-end-day/appointment-end-day.component';

import { PatientsComponent } from './pages/patients/patients.component';
import { PatientDetailsComponent } from './pages/patients/patient-details/patient-details.component';
import { PatientAppointmentHistoryComponent } from './pages/patients/patient-appointment-history/patient-appointment-history.component';

import { AreasComponent } from './pages/areas/areas.component';
import { AreaDetailsComponent } from './pages/areas/area-details/area-details.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AlertsComponent,
    MonthNamePipe,
    DurationMinutesPipe,
    TimeMinutesPipe,
    StatusDescriptionPipe,
    AreasDescriptionPipe,
    CalendarComponent,
    AppointmentsComponent,
    AppointmentActionsComponent,
    AppointmentEndDayComponent,
    PatientsComponent,
    PatientDetailsComponent,
    PatientAppointmentHistoryComponent,
    AreasComponent,
    AreaDetailsComponent
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
