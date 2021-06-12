import { NgModule } from "@angular/core";
import { ClarityModule } from "@clr/angular";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "../core/core.module";
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
  MatFormFieldModule,
  MatCheckboxModule,
} from "@angular/material";
import { PatientsComponent } from "./components/patients.component";
import { PatientDetailsComponent } from "./components/patient-details/patient-details.component";
import { PatientAppointmentHistoryComponent } from "./components/patient-appointment-history/patient-appointment-history.component";
import { RouterModule } from "@angular/router";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    RouterModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatCheckboxModule,
  ],
  declarations: [
    PatientsComponent,
    PatientDetailsComponent,
    PatientAppointmentHistoryComponent,
  ],
  entryComponents: [PatientAppointmentHistoryComponent],
  providers: [AngularFireAuthGuard],
})
export class PatientsModule {}
