import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { CoreModule } from "../core/core.module";
import { RouterModule } from "@angular/router";

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
  MatListModule,
  MatCheckboxModule,
} from "@angular/material";

import { AppointmentsComponent } from "./components/appointments.component";
import { AppointmentDetailsComponent } from "./components/appointment-details/appointment-details.component";
import { AppointmentActionsComponent } from "./components/appointment-actions/appointment-actions.component";
import { AppointmentEndDayComponent } from "./components/appointment-end-day/appointment-end-day.component";
import { AppointmentPaymentComponent } from "./components/appointment-payment/appointment-payment.component";
import { StatusDescriptionPipe } from "./pipes/status-description.pipe";
import { TimeMinutesPipe } from "./pipes/time-minutes.pipe";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";

@NgModule({
  imports: [
    CommonModule,
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
    MatListModule,
    MatCheckboxModule,
  ],
  declarations: [
    AppointmentsComponent,
    AppointmentDetailsComponent,
    AppointmentActionsComponent,
    AppointmentEndDayComponent,
    StatusDescriptionPipe,
    TimeMinutesPipe,
    AppointmentPaymentComponent,
  ],
  entryComponents: [AppointmentEndDayComponent, AppointmentPaymentComponent],
  providers: [AngularFireAuthGuard],
})
export class AppointmentsModule {}
