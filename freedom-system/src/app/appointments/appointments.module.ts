import { NgModule } from '@angular/core';
import { ClarityModule,ClrFormsNextModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from '../core/core.module';
import { RouterModule } from '@angular/router';

import { AppointmentsComponent } from './components/appointments.component';
import { AreasDescriptionPipe } from './pipes/areas-description.pipe';
import { StatusDescriptionPipe } from './pipes/status-description.pipe';
import { TimeMinutesPipe } from './pipes/time-minutes.pipe';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { AppointmentActionsComponent } from './components/appointment-actions/appointment-actions.component';
import { AppointmentEndDayComponent } from './components/appointment-end-day/appointment-end-day.component';


@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    ClrFormsNextModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
    CoreModule
  ],
  declarations: [ 
    AppointmentsComponent,
    AppointmentDetailsComponent,
    AppointmentActionsComponent,
    AppointmentEndDayComponent,
    AreasDescriptionPipe,
    StatusDescriptionPipe,
    TimeMinutesPipe
  ]
})
export class AppointmentsModule { }