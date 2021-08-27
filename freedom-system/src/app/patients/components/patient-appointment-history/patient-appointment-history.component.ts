import { Component, ViewChild, Inject, OnInit } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { AppointmentPatient } from "../../models/appointment-patient";
import { PatientService } from "../../../patients/services/patient.service";
import { AlertService } from "../../../core/services/alert/alert.service";
import { ApplicationStateService } from "../../../core/services/aplication-state/aplication-state.service";
import { NgxSpinnerService } from "ngx-spinner";

export interface ModalData {
  title: string;
  patientId: string;
}
@Component({
  selector: "patient-appointment-history",
  templateUrl: "./patient-appointment-history.component.html",
  styleUrls: ["./patient-appointment-history.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class PatientAppointmentHistoryComponent implements OnInit {
  patientId: string;
  mobileView: Boolean = false;
  displayedColumns: string[] = ["date", "areas", "status", "observations"];
  displayedMobileColumns: string[] = ["expand", "date", "areas"];
  dataSource: MatTableDataSource<AppointmentPatient>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private patientService: PatientService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private aplicationStateService: ApplicationStateService,
    public dialogRef: MatDialogRef<PatientAppointmentHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {
    this.patientId = data.patientId;
  }

  ngOnInit() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
    if (this.patientId) {
      // this.spinner.show();
      this.patientService.getPatientHistory$(this.patientId).subscribe(
        (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // this.spinner.hide();
        },
        (error) => {
          // this.spinner.hide();
          this.alertService.error(error);
        }
      );
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
