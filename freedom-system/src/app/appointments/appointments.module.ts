import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from '../core/core.module';
import { RouterModule } from '@angular/router';

import { 
  MatButtonModule, 
  MatIconModule, 
  MatTableModule, 
  MatPaginatorModule, 
  MatSortModule, 
  MatSelectModule, 
  MatInputModule, 
  MatDialogModule, 
  MatDividerModule, 
  MatCardModule, 
  MatSlideToggleModule, 
  MatGridListModule,
  MatListModule } from '@angular/material';

import { AppointmentsComponent } from './components/appointments.component';
import { StatusDescriptionPipe } from './pipes/status-description.pipe';
import { TimeMinutesPipe } from './pipes/time-minutes.pipe';
import { AppointmentDetailsComponent } from './components/appointment-details/appointment-details.component';
import { AppointmentActionsComponent } from './components/appointment-actions/appointment-actions.component';
import { AppointmentEndDayComponent } from './components/appointment-end-day/appointment-end-day.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';


@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
    CoreModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatDialogModule,
    MatListModule
  ],
  declarations: [ 
    AppointmentsComponent,
    AppointmentDetailsComponent,
    AppointmentActionsComponent,
    AppointmentEndDayComponent,
    // AreasDescriptionPipe,
    StatusDescriptionPipe,
    TimeMinutesPipe
  ],
  entryComponents: [AppointmentEndDayComponent],
  providers: [AngularFireAuthGuard]
})
export class AppointmentsModule { }
